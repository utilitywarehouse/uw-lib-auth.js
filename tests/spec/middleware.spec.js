import AuthMiddleware from '../../src/authMiddleware';

describe('middleware', function () {
  it('attaches auth context to the request', async function () {
    const api = {tokenOwner: sinon.mock()};
    const authMiddleware = new AuthMiddleware(api);

    api.tokenOwner.returns({ scopes: ['read'] });

    let request = {headers: {authorization: 'Bearer AbCdEf123456'}};
    let response = {};
    let next = sinon.spy();

    await authMiddleware.middleware(request, response, next);

    next.should.have.been.called;
    request.auth.scopes.should.be.eql(['read']);
  });

});