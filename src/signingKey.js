const fs = require('fs');

module.exports = function() {
  const keyFile = process.env.AUTH_KEY_FILE;
  let signingKey;

  if (!keyFile) {
    signingKey = process.env.AUTH_KEY;
  } else {
    signingKey = fs.readFileSync(keyFile);
  }

  if (!signingKey) {
    throw new Error('Could not look up a signing key, make sure either AUTH_KEY_FILE or AUTH_KEY env is set.');
  }

  return signingKey;
};