const fs = require('fs');
const jwt = require('jsonwebtoken');

class Method {
	applies() {
		throw new Error('Missing implementation');
	}

	execute(headers, callback) {
		callback(new Error('Missing implementation'), null);
	}
}

class Provider {
	constructor(methods = []) {
		if (!Array.isArray(methods)) {
			const badType = typeof (methods);
			throw new Error(`Expected methods array, got ${badType} instead.`);
		}

		const badMethods = methods.filter(m => !(m instanceof Method));

		if (badMethods.length > 0) {
			const badType = typeof (badMethods[0]);
			throw new Error(`Unexpected Method, expected instance of Method, got ${badType} instead`);
		}

		this.methods = methods;
	}

	execute(headers, returnCallback) {
		let handler = null;

		for (let i = 0; !handler && i < this.methods.length; i++) {
			if (this.methods[i].applies(headers)) {
				handler = this.methods[i];
			}
		}

		if (!handler) {
			return returnCallback(new Error('Could not match handler'));
		}

		handler.execute(headers, (err, result, credentials) => {
			return returnCallback(err, result, credentials);
		});
	}

	middleware() {
		return (req, res, next) => {
			this.execute(req.headers, (err, result, credentials) => {
				if (err) {
					return next({status: 401, message: 'Unauthorized', previous: err});
				}
				req.auth = result;
				req.auth.credentials = credentials;
				next();
			});
		};
	}
}

const ALGO_RS256 = 'RS256';

class Key {
	static get RS256() {
		return ALGO_RS256;
	}

	static fromFile(filePath) {
		let key;
		try {
			key = fs.readFileSync(filePath);
		} catch (err) {
			throw new Error('Could not read key file');
		}
		return new Key(key);
	}

	static fromString(key) {
		return new Key(key.replace(/\\n/g, "\n"));
	}

	constructor(key) {
		if (!key) {
			throw new Error('Key cannot be empty');
		}
		this.key = key;
	}
}

const SOURCE_HEADER = 'header';
const KEY_AUTHORIZATION = 'authorization';

class Credentials {
	constructor(source, key, value) {
		this.source = source;
		this.key = key;
		this.value = value;
	}
}

class oAuth2JWTMethod extends Method {
	constructor({key, algo} = {}) {
		super();
		if (!(key instanceof Key)) {
			const badType = typeof (key);
			throw new Error(`Expected an instance of Key, got ${badType} instead`);
		}
		this.key = key;
		this.algo = algo || [Key.RS256];
	}

	applies(headers) {
		if (!Object.getOwnPropertyDescriptor(headers, 'authorization')) {
			return false;
		}

		if (!headers.authorization) {
			return false;
		}

		if (!/^Bearer .*/.test(headers.authorization)) {
			return false;
		}

		return true;
	}

	execute(headers, callback) {
		const parts = headers.authorization.match(/^Bearer\s+(.*)/);

		jwt.verify(parts[1], this.key.key, {algorithms: this.algo}, function (err, payload) {
			if (err) {
				return callback(err);
			}

			callback(null, payload, new Credentials(SOURCE_HEADER, KEY_AUTHORIZATION, parts[0]));
		});
	}
}

module.exports.Provider = Provider;
module.exports.Method = {
	Method: Method,
	oAuth2JWT: oAuth2JWTMethod
};
module.exports.Key = Key;
module.exports.oAuth2JWT = options => {
	return new Provider([
		new oAuth2JWTMethod(options) // eslint-disable-line new-cap
	]);
};
