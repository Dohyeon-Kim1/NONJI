import os
import json
import numpy as np
from openai import OpenAI

from .prompt import PAPER_EMBED, SCHEDULE_SYSTEM, SCHEDULE_USER


OPENAI_KEY = None
PERPLEXITY_KEY = None


OPENAI_CLIENT = OpenAI(api_key=OPENAI_KEY)
PERPLEXITY_CLIENT = OpenAI(api_key=PERPLEXITY_KEY, base_url="https://api.perplexity.ai")


def paper_embed(data):
    text = PAPER_EMBED.format(
        title=data["title"],
        abstract=data["abstract"]
    ).replace("\n", " ")
    response = OPENAI_CLIENT.embeddings.create(
        input=text,
        model="text-embedding-3-large"
    )
    embed = np.array(response.data[0].embedding, dtype=np.float32)
    return embed


def text_embed(text):
    text = text.replace("\n", " ")
    response = OPENAI_CLIENT.embeddings.create(
        input=text,
        model="text-embedding-3-large"
    )
    embed = np.array(response.data[0].embedding, dtype=np.float32)
    return embed


# 장소 추천을 위한 대화 생성 함수
def schedule_generate(conversation):
    # SCHEDULE_USER 템플릿을 실제 대화 내용으로 동적으로 채우기
    user_prompt = SCHEDULE_USER.format(PASTE_CONVERSATION_HERE=conversation)

    # 메시지 형식으로 API에 전달
    messages = [
        {"role": "system", "content": SCHEDULE_SYSTEM},
        {"role": "user", "content": user_prompt}
    ]

    # Perplexity API에 요청을 보내고 결과 받아오기
    response = PERPLEXITY_CLIENT.chat.completions.create(
        messages=messages,
        model="sonar-pro"
    )
    print(f"response의 타입 {type(response)}")
    print(response)
    # 응답 및 인용 정보 처리
    output = response.choices[0].message.content
    citations = response.citations
    return response, citations

# JSON 파일에서 대화 데이터를 로드하고 처리
def process_conversations(conversations):

    outputs = []

    # 각 대화 처리
    for idx, conversation in enumerate(conversations):
        print(f"Processing conversation {idx + 1}...")
        # 대화 예시를 문자열로 변환
        # conversation_text = "\n".join([f"User1: {conversation.get(f'User1_{i}', '')}\nUser2: {conversation.get(f'User2_{i}', '')}" for i in range(1, 6)])
        conversation_text = "\n".join([f"{chat['userID']}: {chat['message']}" for chat in conversation])
        # 장소 추천 대화 생성
        response, citations = schedule_generate(conversation_text)

        # 결과 출력
        print(f"Response for conversation {idx + 1}:")
        print(response.choices[0].message.content)  # 대화 추천 결과 출력
        print(f"Citations: {citations}\n")

        outputs.append({
                "response": response.choices[0].message.content, 
                "citations": citations
            })

    return outputs
    