const fs = require('fs');
const signingKey = require('../../src/signingKey');

describe('signingKey', function () {
  it('provides key stored in env variable', function () {
    process.env.AUTH_KEY = 'secret';
    signingKey().should.be.eql('secret');
  });

  it('provides key stored in file', function () {
    delete process.env.AUTH_KEY;
    process.env.AUTH_KEY_FILE = './tests/resources/public.pem';
    signingKey().should.be.eql(fs.readFileSync('./tests/resources/public.pem'));
  });

  it('throws an exception when both key variable and key filename doesn\'t exist', function () {
    delete process.env.AUTH_KEY;
    delete process.env.AUTH_KEY_FILE;
    (() => signingKey()).should.throw();
  });
});