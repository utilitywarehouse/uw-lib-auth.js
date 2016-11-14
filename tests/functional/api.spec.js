const fs = require('fs');
const jwt = require('jsonwebtoken');
const tokenOwner = require('../../index').tokenOwner;

describe('Api', function () {
  before(function () {
    const key = fs.readFileSync('tests/resources/private.key');
    this.payload = { foo: 'bar' };
    this.validToken = jwt.sign({ sub: this.payload }, key, { algorithm: 'RS256'});
  });

  it('verifies token', async function () {
    const payload = await tokenOwner(this.validToken);
    payload.should.be.eql(this.payload);
  });
});