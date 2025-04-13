const fs = require('fs');
const path = require('path');

// JSON 파일 읽기
function readJSON(filePath) {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  const data = fs.readFileSync(fullPath, 'utf-8');
  return JSON.parse(data);
}

// JSON 파일 쓰기
function writeJSON(filePath, data) {
  const fullPath = path.resolve(filePath);
  const dir = path.dirname(fullPath);

  // 디렉토리 없으면 생성
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf-8');
}

// JSON 파일 삭제
function deleteJSON(filePath) {
  const fullPath = path.resolve(filePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
}

// 파일 존재 여부 확인
function fileExists(filePath) {
  return fs.existsSync(path.resolve(filePath));
}

module.exports = {
  readJSON,
  writeJSON,
  deleteJSON,
  fileExists
};
