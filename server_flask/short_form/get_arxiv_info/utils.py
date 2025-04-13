import os

curr_dir = os.path.dirname(os.path.abspath(__file__))

def remove_duplicates_preserve_order(lines):
    seen = set()
    unique_lines = []
    for line in lines:
        if line not in seen:
            seen.add(line)
            unique_lines.append(line)
    return unique_lines

def get_arxiv_imgs_path(arxiv_id):
    try:
        rel_path = f"../data/img_data/{arxiv_id}"
        img_path = os.path.join(curr_dir, rel_path)
        img_names = [f"{img_path}/{name}" for name in os.listdir(img_path)]
        # print(img_names)

        return img_names
    except Exception as e:
        print(f'[!] {arxiv_id}에 대한 이미지를 찾을 수 없습니다.')
        print('-'*50)
        print(e)
        return None