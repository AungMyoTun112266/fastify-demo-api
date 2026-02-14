AES_SECRET_KEY
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

HMAC_SECRET_KEY
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
