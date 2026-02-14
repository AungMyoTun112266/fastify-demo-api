AES_SECRET_KEY
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

HMAC_SECRET_KEY
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

{
  "iv": "Qs9pTq1Mr2+r2Oym",
  "tag": "PHxnmVE7M+H5JDdpSFYqzA==",
  "data": "VJ9Il7POnE80lsbfeIixYKRs6KR5FzMNB7mDp9SsNUX1hp/68M73y8azrOUQeXRwoA==",
  "nonce": "47617be1-ccc4-4315-98ba-a165a40d9df2"
}