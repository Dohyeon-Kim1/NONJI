from gtts import gTTS
import os
from pydub import AudioSegment

def create_TTS(arxiv_id, full_text, block_size=3):
    """
    gTTS를 사용해 full_text를 음성 파일로 저장.
    - arxiv_id별로 ./data/tts_data/{arxiv_id}/ 경로에 저장
    - 문장을 block_size개씩 묶어 저장
    """
    from pathlib import Path
    import re

    save_dir = f'./data/tts_data/{arxiv_id}'
    os.makedirs(save_dir, exist_ok=True)

    # 문장 단위로 나누기
    sentences = re.split(r'(?<=[.!?]) +', full_text.strip())

    block_index = 1
    for i in range(0, len(sentences), block_size):
        block = sentences[i:i + block_size]
        block_text = " ".join(block)

        try:
            # gTTS로 mp3 저장
            tts = gTTS(text=block_text, lang='en')
            mp3_path = os.path.join(save_dir, f'block_{block_index}.mp3')
            wav_path = os.path.join(save_dir, f'output_cut_{block_index}.wav')
            tts.save(mp3_path)

            # mp3 → wav 변환
            sound = AudioSegment.from_mp3(mp3_path)
            sound.export(wav_path, format="wav")

            print(f"Converted to WAV: {wav_path}")
            block_index += 1

        except Exception as e:
            print(f"TTS 생성 실패 (block {block_index}): {e}")
            continue
