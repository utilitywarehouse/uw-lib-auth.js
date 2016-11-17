const authModule = require('./../..');
const path = require('path');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const partnerId = 'K97777';

describe('Auth', function () {
  describe('Provider', function(){
    describe('Middleware', function () {
      before(function(){
        const key = fs.readFileSync(path.join(__dirname, '../resources/private.key'));
        this.payload = { scopes: [`partner.${partnerId}.read`] };
        this.token = jwt.sign(this.payload, key, { algorithm: 'RS256'});

        this.auth = new authModule.Provider([
          new authModule.Method.oAuth2JWT({
            key: authModule.Key.fromFile(path.join(__dirname, '../resources/public.pem')),
            algo: [authModule.Key.RS256]
          })
        ]);
      });

      it('adds auth context to the request', function(done){
        let request = {headers: {authorization: `Bearer ${this.token}`}};
        let response = {};

        this.auth.middleware()(request, response, () => {
          expect(request.auth).to.be.an.instanceOf(authModule.Authorisation.ScopeBased);
          done();
        });
      });

      it('resolves with Unauthorized error when the token cannot be verified', function(done){
        let request = {headers: {authorization: `Bearer Abcdefg1234567`}};
        let response = {};

        this.auth.middleware()(request, response, (args) => {
          expect(args).to.contain.property('status', 401);
          expect(args).to.contain.property('message', 'Unauthorized');
          expect(request).to.not.contain.property('auth');
          done();
        });
      });
    });
  });
	describe('Methods', function () {
		describe('oAuth2JWT', function () {
			it('authenticates user using header included token', function(done) {
        const key = fs.readFileSync(path.join(__dirname, '../resources/private.key'));
        const payload = { scopes: [`partner.${partnerId}.read`] };
        const token = jwt.sign(payload, key, { algorithm: 'RS256'});

        const oauthMethod = new authModule.Method.oAuth2JWT({
          key: authModule.Key.fromFile(path.join(__dirname, '../resources/public.pem')),
          algo: [authModule.Key.RS256]
        });

        oauthMethod.execute({authorization: `Bearer ${token}`}, (err, result) => {
          expect(result).to.be.an.instanceOf(authModule.Authorisation.ScopeBased);
          expect(result.canReadPartnerInformation(partnerId)).to.equal(true);
          expect(err).to.be.null;
          done();
        });
			});
		});
	});
});
