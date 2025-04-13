const crypto = require('crypto');

// 간단한 UUID 생성기 (base36으로)
function generateID(prefix = '') {
  const randomPart = crypto.randomBytes(8).toString('hex');
  const timestamp = Date.now().toString(36);
  return `${prefix}${timestamp}-${randomPart}`;
}

module.exports = {
  generateID
};
