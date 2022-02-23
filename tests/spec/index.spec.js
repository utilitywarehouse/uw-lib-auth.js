const authModule = require("./../..");
const path = require("path");
const expect = require("chai").expect;
const sinon = require("sinon");

describe("Auth", function () {
	describe("Provider", function () {
		it("requires Methods to be passed", function () {
			expect(() => new authModule.Provider(["not a method"])).to.throw();
		});
		describe("execute", function () {
			it("rejects when no methods are applicable", function (done) {
				const provider = new authModule.Provider();

				provider.execute([], (err) => {
					expect(err).to.exist.and.to.be.an.instanceOf(Error);
					done();
				});
			});
			it("throws when a method is applicable and returns with error", function (done) {
				const stub = sinon.createStubInstance(authModule.Method.Method);
				const provider = new authModule.Provider([stub]);
				stub.applies = () => true;

				stub.execute = function ([], callback) {
					callback(new Error());
				};

				provider.execute([], (err, result) => {
					expect(result).to.not.exist;
					expect(err).to.exist.and.to.be.an.instanceOf(Error);
					done();
				});
			});

			it("resolves with method return", function (done) {
				const stub = sinon.createStubInstance(authModule.Method.Method);
				const provider = new authModule.Provider([stub]);
				stub.applies = () => true;

				stub.execute = function ([], callback) {
					callback(null, 123, 456);
				};

				provider.execute([], (err, result, credentials) => {
					expect(err).to.not.exist;
					expect(result).to.exist.and.to.be.equal(123);
					expect(credentials).to.exist.and.to.be.equal(456);
					done();
				});
			});
		});
	});
	describe("Methods", function () {
		describe("oAuth2JWT", function () {
			it("requires key to be passed on construct", function () {
				expect(() => new authModule.Method.oAuth2JWT()).to.throw();

				const method = new authModule.Method.oAuth2JWT({
					key: new authModule.Key("key"),
				});

				expect(method).to.be.an.instanceof(authModule.Method.oAuth2JWT);
			});

			it("defaults algo to RS256 if none provided", function () {
				const method = new authModule.Method.oAuth2JWT({
					key: new authModule.Key("key"),
				});

				expect(method.algo).to.deep.equal([authModule.Key.RS256]);
			});

			it(`applies when headers contain 'authorization: Bearer'`, function () {
				const method = new authModule.Method.oAuth2JWT({
					key: new authModule.Key("key"),
				});

				expect(method.applies({})).to.equal(false);
				expect(method.applies({ authorization: null })).to.equal(false);
				expect(method.applies({ authorization: "Bearer" })).to.equal(false);
				expect(method.applies({ authorization: "Bearer token" })).to.equal(
					true
				);
			});
		});
	});
	describe("Key", function () {
		it("requires key to be passed on construct", function () {
			expect(() => new authModule.Key()).to.throw();
		});
		describe("static - fromString", function () {
			it("can statically be constructed from string", function () {
				expect(authModule.Key.fromString("key")).to.be.an.instanceOf(
					authModule.Key
				);
			});
		});
		describe("static - fromFile", function () {
			it("throws when provided file does not exist", function () {
				expect(() => authModule.Key.fromFile("obviously-invalid")).to.throw();
			});
			it("can statically be constructed from file", function () {
				expect(
					authModule.Key.fromFile(
						path.join(__dirname, "../resources/public.pem")
					)
				).to.be.an.instanceOf(authModule.Key);
			});
		});
	});
	describe("oAuth2JWT", function () {
		it("creates a provider instance with the oAuth2JWT method included", function () {
			const key = new authModule.Key("key");
			expect(authModule.oAuth2JWT({ key }).methods).to.have.lengthOf(1);
			expect(authModule.oAuth2JWT({ key }).methods[0]).to.be.instanceOf(
				authModule.Method.oAuth2JWT
			);
		});
	});
});
