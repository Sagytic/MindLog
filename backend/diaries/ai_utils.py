import os
from openai import OpenAI
from dotenv import load_dotenv

# 이 파일이 실행될 때 .env를 강제로 읽음
load_dotenv()


def analyze_diary(content):
    """
    일기 내용을 받아서 감정과 조언을 반환하는 함수
    """
    try:
        # [이동] 함수가 실행될 때(일기 저장 버튼 누를 때) 클라이언트를 생성합니다.
        # 서버 켤 때는 키가 없어도 에러가 안 남.
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

        system_instruction = """
        당신은 심리 상담가입니다. 사용자의 일기를 읽고 다음 두 가지를 JSON 형식으로 답변해주세요.
        
        1. emotion: 일기에 담긴 핵심 감정을 2개 이상 10개 이하의 단어로 추출해주세요. (단어들은 쉼표로 구분. 예: "불안, 슬픔, 답답함")
        2. advice: 작성자에게 해줄 따뜻한 위로와 조언 (2~3문장)
        
        답변 형식 예시:
        {"emotion": "우울, 무기력, 답답함", "advice": "많이 힘드셨겠어요..."}
        """

        response = client.chat.completions.create(
            model="gpt-4o-mini", 
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": content}
            ],
            response_format={"type": "json_object"}
        )

        import json
        result = json.loads(response.choices[0].message.content)
        
        return result

    except Exception as e:
        print(f"OpenAI Error: {e}")
        return {"emotion": "분석 실패", "advice": "AI가 잠시 쉬고 있어요."}