import jwt from 'jsonwebtoken';

export default class Api {
  _signingKey;

  constructor(signingKey) {
    this._signingKey = signingKey;
  }

  tokenOwner(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this._signingKey, { algorithms: ['RS256'] }, function (err, payload) {
        if (err) {
          const error = new Error('Unauthorized');
          error.status = 401;

          return reject(error);
        }
        resolve(payload.sub);
      });
    });
  }
}