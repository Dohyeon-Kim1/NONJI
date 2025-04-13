import os
import re
import numpy as np
import textwrap
from PIL import Image, ImageDraw, ImageFont
from gtts import gTTS
from pydub import AudioSegment
from moviepy.editor import (
    ImageClip, ColorClip, CompositeVideoClip,
    concatenate_videoclips, AudioFileClip
)

# ---- 영상 전체 크기 (가로형 1280×720)
VIDEO_WIDTH = 1280
VIDEO_HEIGHT = 720
FINAL_SIZE = (VIDEO_WIDTH, VIDEO_HEIGHT)

# ---- 상단 이미지 영역: 전체 높이의 70% (504px)
IMAGE_AREA_HEIGHT = int(VIDEO_HEIGHT * 0.7)  # 504
# ---- 하단 자막 영역: 나머지 30% (216px)
TEXT_AREA_HEIGHT = VIDEO_HEIGHT - IMAGE_AREA_HEIGHT  # 216


def create_text_image(text, size, fontsize=30, font_path=None,
                      text_color="black", bg_color="white", wrap_width=70):
    """
    자막 텍스트 이미지를 생성하되, 패딩 없이 꽉 차게 텍스트를 중앙에 배치.
    테두리는 1px 검정.
    """
    img = Image.new("RGB", size, color=bg_color)
    draw = ImageDraw.Draw(img)

    try:
        if font_path is None:
            font_path = "/Library/Fonts/Arial.ttf"
        font = ImageFont.truetype(font_path, fontsize)
    except Exception as e:
        print("폰트 로드 실패:", e)
        font = ImageFont.load_default()

    wrapped_text = "\n".join(textwrap.wrap(text, width=wrap_width))

    try:
        bbox = draw.multiline_textbbox((0, 0), wrapped_text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
    except AttributeError:
        lines = wrapped_text.split("\n")
        text_width = 0
        text_height = 0
        for line in lines:
            line_w, line_h = draw.textsize(line, font=font)
            text_width = max(text_width, line_w)
            text_height += line_h

    text_position = (
        (size[0] - text_width) // 2,
        (size[1] - text_height) // 2
    )

    draw.multiline_text(text_position, wrapped_text, font=font,
                        fill=text_color, align="center")

    draw.rectangle([0, 0, size[0]-1, size[1]-1], outline="black", width=1)

    return np.array(img)


def letterbox_image_clip(img_clip, target_width, target_height, duration):
    """
    원본 비율을 유지하면서 target_width × target_height 영역에
    이미지(비디오) 클립을 레터박스 형태로 중앙 배치한 CompositeVideoClip 생성.
    """
    factor = min(target_width / img_clip.w, target_height / img_clip.h)
    resized_img = img_clip.resize(factor)

    bg = ColorClip(size=(target_width, target_height), color=(255, 255, 255))\
         .set_duration(duration)

    comp_clip = CompositeVideoClip([
        bg,
        resized_img.set_position(("center", "center"))
    ], size=(target_width, target_height)).set_duration(duration)

    return comp_clip


def create_shorts_video_horizontal(arxiv_id, script_response, img_dir, tts_dir):
    """
    가로(1280×720) 영상 생성 함수. TTS는 gTTS 기반으로 생성되며,
    각 문장마다 이미지 + 자막 + 음성 클립을 만들어 연결한다.
    완성된 영상은 ../shorts_video/{arxiv_id}.mp4 로 저장됨.
    """
    shorts_dir = os.path.join(os.path.dirname(tts_dir), "../shorts_video")
    os.makedirs(shorts_dir, exist_ok=True)
    final_video_path = os.path.join(shorts_dir, f"{arxiv_id}.mp4")

    cut_blocks = re.findall(r'\[CUT_START\](.*?)\[CUT_END\]', script_response, re.DOTALL)
    mini_clips = []

    image_files = sorted(
        os.path.join(img_dir, f) for f in os.listdir(img_dir)
        if f.lower().endswith(('.png', '.jpg', '.jpeg'))
    )
    num_images = len(image_files)
    image_index = 0

    for cut_idx, block in enumerate(cut_blocks, start=1):
        figure_matches = re.findall(r'\[FIGURE:\s*(.*?)\]', block)
        figure_path = figure_matches[0].strip() if figure_matches else None

        text_block = re.sub(r'\[FIGURE:.*?\]', '', block).strip()
        if not text_block:
            continue

        sentences = re.split(r'(?<=[.!?])\s+', text_block)
        for sent_idx, sentence in enumerate(sentences, start=1):
            sentence = sentence.strip()
            if not sentence:
                continue

            # (1) gTTS 생성
            tts_filename_mp3 = f"block_{cut_idx}_sentence_{sent_idx}.mp3"
            tts_filepath_mp3 = os.path.join(tts_dir, tts_filename_mp3)
            tts_filename_wav = f"block_{cut_idx}_sentence_{sent_idx}.wav"
            tts_filepath_wav = os.path.join(tts_dir, tts_filename_wav)

            try:
                tts = gTTS(text=sentence, lang='en')
                tts.save(tts_filepath_mp3)

                sound = AudioSegment.from_mp3(tts_filepath_mp3)
                sound.export(tts_filepath_wav, format="wav")
                print(f"✅ TTS 생성 완료: {tts_filepath_wav}")
            except Exception as e:
                print(f"❌ TTS 생성 실패 (gTTS) [CUT={cut_idx}, SENT={sent_idx}]: {e}")
                continue

            try:
                audio_clip = AudioFileClip(tts_filepath_wav)
            except Exception as e:
                print(f"❌ 오디오 로드 실패: {e}")
                continue

            duration = audio_clip.duration

            # (2) 이미지 처리
            if figure_path and os.path.exists(figure_path):
                try:
                    img_raw = ImageClip(figure_path)
                except Exception as e:
                    print(f"Figure 로드 실패: {e}")
                    img_raw = None
            else:
                img_raw = None

            if img_raw is None:
                if num_images > 0:
                    alt_path = image_files[image_index % num_images]
                    image_index += 1
                    img_raw = ImageClip(alt_path)
                else:
                    img_raw = ColorClip(size=(VIDEO_WIDTH, IMAGE_AREA_HEIGHT), color=(255,255,255))

            img_clip = letterbox_image_clip(img_raw, VIDEO_WIDTH, IMAGE_AREA_HEIGHT, duration)

            # (3) 자막 처리
            TEXT_WIDTH = int(VIDEO_WIDTH * 1)
            text_image_array = create_text_image(
                sentence,
                (TEXT_WIDTH, TEXT_AREA_HEIGHT),
                fontsize=30,
                font_path="/Library/Fonts/Arial.ttf",
                text_color="black",
                bg_color="white",
                wrap_width=85
            )
            txt_clip = ImageClip(text_image_array).set_duration(duration)
            text_x = (VIDEO_WIDTH - TEXT_WIDTH) // 2
            txt_clip = txt_clip.set_position((text_x, IMAGE_AREA_HEIGHT))

            # (4) 합성
            background = ColorClip(FINAL_SIZE, color=(255, 255, 255)).set_duration(duration)
            img_clip = img_clip.set_position((0, 0))
            comp_clip = CompositeVideoClip([background, img_clip, txt_clip], size=FINAL_SIZE)\
                         .set_audio(audio_clip).set_duration(duration)

            mini_clips.append(comp_clip)
            mini_clips.append(comp_clip.to_ImageClip(duration=1))  # freeze

    if not mini_clips:
        print("생성된 클립이 없습니다.")
        return

    if isinstance(mini_clips[-1], ColorClip) and mini_clips[-1].duration == 1:
        mini_clips.pop()

    final_clip = concatenate_videoclips(mini_clips, method="compose")
    final_clip.write_videofile(final_video_path, fps=24)
    print(f"🎬 최종 영상 파일 생성 완료: {final_video_path}")

    return final_video_path
