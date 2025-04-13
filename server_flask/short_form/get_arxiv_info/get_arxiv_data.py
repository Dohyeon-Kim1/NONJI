import os
import re
import json
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from .utils import *
from PIL import Image, ExifTags

def correct_orientation(image_path):
    """
    이미지 파일(image_path)을 열어 EXIF Orientation 정보를 확인하고,
    필요 시 올바른 방향으로 회전시킨 후 저장합니다.
    """
    try:
        image = Image.open(image_path)
        exif = image._getexif()
        if exif is not None:
            # Orientation 태그 번호 찾기
            orientation_key = None
            for key, value in ExifTags.TAGS.items():
                if value == 'Orientation':
                    orientation_key = key
                    break
            if orientation_key is not None:
                orientation = exif.get(orientation_key, 1)
                # Orientation 값에 따라 이미지 회전
                if orientation == 3:
                    image = image.rotate(180, expand=True)
                elif orientation == 6:
                    image = image.rotate(270, expand=True)
                elif orientation == 8:
                    image = image.rotate(90, expand=True)
                # 회전 후 저장
                image.save(image_path)
    except Exception as e:
        print(f"[!] Orientation correction failed for {image_path}: {e}")

def get_arxiv_full_data(arxiv_id):
    """
    논문의 arxiv_id를 넣으면 다음을 반환:
    
    {
        "html_url": html_url, # 크롤링해온 url
        "saved_image_count": img_count, # 저장된 이미지의 개수
        "full_text": final_text, # 본문 전체 (latex 수식과 table 포함)
        "title": title # 논문의 제목
    }
    
    그리고 ./data/img_data/{arxiv_id} 경로에 Figure_{n}.png 형식으로 논문 내 사진들을 저장하며,
    저장 후 이미지가 돌려진 경우 자동으로 올바른 방향으로 회전시킵니다.
    """

    html_url = f"https://arxiv.org/html/{arxiv_id}"
    img_dir = f"./data/img_data/{arxiv_id}"
    os.makedirs(img_dir, exist_ok=True)

    # 1. HTML 전문 가져오기
    res = requests.get(html_url)
    if res.status_code != 200:
        return {"error": "HTML fulltext not available."}
    soup = BeautifulSoup(res.text, 'html.parser')

    # 1-1. 논문의 제목(title) 추출 (보통 <h1 class="ltx_title"> 태그에 있음)
    title = ""
    title_tag = soup.find('h1', class_='ltx_title')
    if title_tag:
        title_text = title_tag.get_text(strip=True)
        if title_text.lower().startswith("title:"):
            title = title_text[len("title:"):].strip()
        else:
            title = title_text
    else:
        title = soup.title.get_text(strip=True) if soup.title else ""

    # 2. 본문 텍스트 + 수식 + 표 통합 (수식은 $...$, 표는 Markdown)
    full_text_with_math = ""
    for elem in soup.find_all(['h1', 'h2', 'h3', 'h4', 'p', 'li', 'div', 'table']):
        if elem.name == 'table':
            rows = elem.find_all('tr')
            table_data = []
            for row in rows:
                cols = [col.get_text(strip=True) for col in row.find_all(['td', 'th'])]
                table_data.append(cols)
            if table_data:
                header = "| " + " | ".join(table_data[0]) + " |\n"
                separator = "| " + " | ".join(['---'] * len(table_data[0])) + " |\n"
                body = ""
                for row in table_data[1:]:
                    body += "| " + " | ".join(row) + " |\n"
                full_text_with_math += header + separator + body + "\n"
        else:
            text_parts = []
            for child in elem.descendants:
                if child.name == 'annotation' and child.get("encoding") == "application/x-tex":
                    text_parts.append(f"${child.text}$")
                elif child.name is None:
                    stripped = child.strip()
                    if stripped:
                        text_parts.append(stripped)
            paragraph = " ".join(text_parts).strip()
            if paragraph:
                full_text_with_math += paragraph + "\n\n"

    # 3. 이미지 저장
    img_count = 0
    # 먼저, figure 태그 안의 이미지 처리 (캡션 정보를 활용)
    for figure in soup.find_all("figure"):
        img_tag = figure.find("img")
        if not img_tag:
            continue
        src = img_tag.get("src")
        if not src:
            continue
        full_url = f"https://arxiv.org/html/{arxiv_id}/{src}"
        figcaption = figure.find("figcaption")
        fig_num = None
        if figcaption:
            m = re.search(r'Figure\s*([\dIVXLCDM]+)', figcaption.get_text())
            if m:
                fig_num = m.group(1)
        if fig_num:
            file_name = f"Figure_{fig_num}{os.path.splitext(urlparse(full_url).path)[-1] or '.jpg'}"
        else:
            file_name = f"img_{img_count + 1}{os.path.splitext(urlparse(full_url).path)[-1] or '.jpg'}"
        try:
            img_data = requests.get(full_url, stream=True)
            img_data.raise_for_status()
            img_path = os.path.join(img_dir, file_name)
            with open(img_path, "wb") as f:
                for chunk in img_data.iter_content(1024):
                    f.write(chunk)
            # 이미지 저장 후 자동 회전 보정
            correct_orientation(img_path)
            img_count += 1
        except Exception as e:
            print(f"[!] 이미지 다운로드 실패: {full_url} → {e}")

    # 나머지 일반 <img> 태그 처리 (figure 태그 밖의 이미지)
    for img in soup.find_all("img"):
        if img.find_parent("figure"):
            continue
        src = img.get("src")
        if not src:
            continue
        full_url = f"https://arxiv.org/html/{arxiv_id}/{src}"
        try:
            img_data = requests.get(full_url, stream=True)
            img_data.raise_for_status()
            parsed = urlparse(full_url)
            ext = os.path.splitext(parsed.path)[-1] or ".jpg"
            file_name = f"img_{img_count + 1}{ext}"
            img_path = os.path.join(img_dir, file_name)
            with open(img_path, "wb") as f:
                for chunk in img_data.iter_content(1024):
                    f.write(chunk)
            correct_orientation(img_path)
            img_count += 1
        except Exception as e:
            print(f"[!] 이미지 다운로드 실패: {full_url} → {e}")

    # 4. 중복 줄 제거한 전체 본문 텍스트 생성
    full_text = full_text_with_math.strip()
    lines = full_text.split('\n')
    final_text_list = remove_duplicates_preserve_order(lines)
    final_text = "\n".join(final_text_list)

    # 5. 결과 반환 (제목 추가)
    return {
        "html_url": html_url,
        "saved_image_count": img_count,
        "full_text": final_text,
        "title": title
    }
