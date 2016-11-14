const signingKey = require('./src/signingKey')();
const Api = require('./src/api').default;
const AuthMiddleware = require('./src/authMiddleware').default;

const api = new Api(signingKey);

module.exports = {
  middleware: function (req, res, next) {
    return (new AuthMiddleware(api).middleware(req, res, next));
  },
  tokenOwner: function (token) {
    return api.tokenOwner(token);
  }
};