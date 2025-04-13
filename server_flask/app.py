from flask import Flask, jsonify, request
import requests
import json
import urllib.parse
import os
from short_form import create_shorts_main
from perplexity import *  # process_conversations 바로 사용
import traceback
from flask_cors import CORS
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

@app.route('/')
def home():
    return "🔥 Hello from Flask on your MacBook!"


# 🔹 방식 1: JSON 문자열 직접 GET 요청으로 전달
@app.route('/api/perplexity/<path:params>', methods=['GET'])
def perplexity_handler(params):
    try:
        decoded = urllib.parse.unquote(params)
        conversations = json.loads(decoded)

        if not isinstance(conversations, list):
            return jsonify({"error": "Invalid conversation list"}), 400

        results = process_conversations([conversations])
        ### 이거 이제 json으로 예쁘게 묶어서 perplexity 생성 답변 프론트에 쏴줘야됨!
        return jsonify({"message": "대화 처리 완료", "results": results})

    except json.JSONDecodeError as e:
        return jsonify({"error": "JSON 디코딩 오류", "detail": str(e)}), 400
    except Exception as e:
        traceback.print_exc()  # 콘솔용 전체 스택 출력
        return jsonify({
            "error": "서버 오류",
            "type": type(e).__name__,
            "message": str(e),
            "traceback": traceback.format_exc()
        }), 500


# 🔹 방식 2: 외부 API로부터 JSON 받아와 처리
@app.route('/api/perplexity-from-url/<string:uuid>', methods=['GET'])
def perplexity_from_url_handler(uuid):
    try:
        target_url = f"https://journalists-sunset-browsers-building.trycloudflare.com/api/chat/log/{uuid}"
        res = requests.get(target_url)

        if res.status_code != 200:
            return jsonify({"error": "외부 요청 실패", "status": res.status_code}), 502

        conversations = res.json()
        if not isinstance(conversations, list):
            return jsonify({"error": "응답 JSON 형식 오류"}), 400

        results = process_conversations([conversations])
        return jsonify({"message": "외부 대화 처리 완료", "results": results})

    except Exception as e:
        return jsonify({"error": "서버 내부 오류", "detail": str(e)}), 500


# 🔹 쇼츠 영상 생성 + 알림 전송
@app.route('/api/shortForm/<string:params>', methods=['GET'])
def short_form_handler(params):
    try:
        user_id, post_id, arxiv_id = params.split('&')
        print("✅ 쇼츠 생성 요청 성공")

        result_path = create_shorts_main(arxiv_id)
        print(f"📂 파일 저장 위치: {result_path}")

        notify_url = "https://journalists-sunset-browsers-building.trycloudflare.com/api/notifications"
        payload = {
            "userID": user_id,
            "message": f"[쇼츠 생성 완료] post_id: {post_id}, arxiv_id: {arxiv_id}"
        }

        headers = {'Content-Type': 'application/json'}
        notify_status = None

        try:
            response = requests.post(notify_url, data=json.dumps(payload), headers=headers)
            notify_status = response.status_code
            print(f"📩 알림 전송 상태 코드: {notify_status}")
        except Exception as e:
            print(f"❗ 알림 전송 실패: {e}")
            notify_status = "failed"

        return jsonify({
            "message": "쇼츠 생성 완료",
            "saved_path": result_path,
            "notification_status": notify_status
        })

    except Exception as e:
        print(f"❌ 에러 발생: {e}")
        return jsonify({"error": "서버 오류", "detail": str(e)}), 500
    
@app.route('/api/recommend', methods=['GET'])
def recommend_papers_handler():
    try:
        query = request.args.get('q', default=None, type=str)
        if not query:
            return jsonify({"error": "검색어(q)가 제공되지 않았습니다."}), 400

        info = {"text": query}
        recommended = recommend_papers(info)

        return jsonify({
            "query": query,
            "results": recommended[:10]  # 상위 10개만 보여주기
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "error": "서버 오류",
            "type": type(e).__name__,
            "message": str(e),
            "traceback": traceback.format_exc()
        }), 500
    
@app.route('/api/recommend-people/<string:user_id>', methods=['GET'])
def recommend_people_handler(user_id):
    try:
        # 1. 외부 유저 파일 요청
        user_file_url = f"https://journalists-sunset-browsers-building.trycloudflare.com/api/users/file/{user_id}"
        res = requests.get(user_file_url)

        if res.status_code != 200:
            return jsonify({"error": "유저 파일 요청 실패", "status": res.status_code}), 502

        user_data = res.json()
        
        # 2. info dict 구성
        hashtags = user_data.get("hashTags", [])
        rep_ids = user_data.get("representatives", [])

        if not isinstance(hashtags, list) or not isinstance(rep_ids, list):
            return jsonify({"error": "유저 데이터 형식 오류"}), 400

        info = {
            "hashtag": hashtags,
            "paper_ids": [int(float(pid)) for pid in rep_ids]  # "1234.123" → 1234
        }

        print('-'*50)
        print(info)
        print('-'*50)

        # 3. 추천 함수 호출
        people = recommend_people(info)
        if people is None:
            return jsonify({"message": "추천 기준이 부족합니다 (hashtag or paper_ids 필요)"}), 400

        return jsonify({
            "user_id": user_id,
            "hashtags": hashtags,
            "paper_ids": rep_ids,
            "recommended_people": people
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "error": "서버 오류",
            "type": type(e).__name__,
            "message": str(e),
            "traceback": traceback.format_exc()
        }), 500

# 🔹 서버 실행
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
