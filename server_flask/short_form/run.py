from .get_arxiv_info import *
from .to_GPT import *
from .get_TTS import *
from .create_video import *

import os
import re
import json
import subprocess
import textwrap
import numpy as np
from moviepy.editor import (ImageClip, ColorClip, CompositeVideoClip,
                            concatenate_videoclips, AudioFileClip)
from PIL import Image, ImageDraw, ImageFont
if not hasattr(Image, "ANTIALIAS"):
    Image.ANTIALIAS = Image.Resampling.LANCZOS

curr_dir = os.path.dirname(os.path.abspath(__file__))

def create_shorts_main(arxiv_id):
    """
    arxiv id를 받으면 그에 따라 쇼츠 생성하는 메인 함수
    """
    arxiv_info_dict = get_arxiv_full_data(arxiv_id)
    arxiv_imgs = get_arxiv_imgs_path(arxiv_id)
    config_json_path = os.path.join(curr_dir, './config.json')
    with open(config_json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    SYSTEM_script = data['SYSTEM_script']
    PROMPT_script = f"""Title: {arxiv_info_dict['title']}
    Text: {arxiv_info_dict['full_text']}
    Image Path: {arxiv_imgs}"""

    script_response = to_GPT(SYSTEM_script, PROMPT_script)['choices'][0]['message']['content']
    create_TTS(arxiv_id, script_response)

    img_dir = f'./data/img_data/{arxiv_id}'
    tts_dir = f'./data/tts_data/{arxiv_id}'

    return create_shorts_video_horizontal(arxiv_id, script_response, img_dir, tts_dir)

     