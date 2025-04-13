import openai
import json
import os

def load_json(file_path):
    """JSON 파일을 읽어서 dict로 반환"""
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data

curr_dir = os.path.dirname(os.path.abspath(__file__))
config_path = os.path.join(curr_dir, '../config.json')

api_key = load_json(config_path)['GPT_API_KEY']
client = openai.OpenAI(api_key=api_key)

def to_GPT(system, prompt, model_type="gpt-4o-mini"):
    # 단어 수 기준으로 토큰 수 추정: 대략 1단어 ≒ 1.5 토큰
    prompt_length = len(prompt.split())
    estimated_tokens = int(prompt_length * 1.5)

    # 최소 1000, 최대 3000 사이로 제한
    max_tokens = min(3000, max(1000, estimated_tokens))

    response = client.chat.completions.create(
        model=model_type,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt}
        ],
        max_tokens=max_tokens,
        temperature=0.5
    ).to_dict()

    return response
