const middleware = require('../../index').middleware;

describe('AuthMiddleware.middleware', function () {
  beforeEach(function () {
    const key = require('fs').readFileSync('tests/resources/private.key');
    this.payload = { foo: 'bar', scopes: ['read'] };
    this.validToken = require('jsonwebtoken').sign({ sub: this.payload }, key, { algorithm: 'RS256'});
  });

  it('be a function', function () {
    middleware.should.be.a.function;
  });

  it('attaches auth context to the request', async function () {
    let request = {headers: {authorization: `Bearer ${this.validToken}`}};
    let response = {};
    let next = sinon.spy();

    await middleware(request, response, next);

    request.auth.scopes.should.be.eql(['read']);
  });
});