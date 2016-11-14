export default class AuthMiddleware {
  _api;

  constructor(api) {
    this._api = api;
  }

  async middleware(req, res, next) {
    if (!req.headers.authorization) {
      return next({status: 401, type: 'Unauthorized'});
    }

    const parts = req.headers.authorization.match(/^Bearer\s+(.*)/);

    if (!parts) {
      return next({status: 401, type: 'Unauthorized'});
    }

    const token = parts[1];

    if (!token) {
      return next({status: 401, type: 'Unauthorized'});
    }

    try {
      const payload = await this._api.tokenOwner(token);

      this._attachAuthContext(req, payload);
      next();
    } catch (err) {
      return next({status: 401, type: 'Unauthorized'});
    }
  }

  _attachAuthContext (request, token) {
    request.auth = {
      scopes: token.scopes
    };
  }
}