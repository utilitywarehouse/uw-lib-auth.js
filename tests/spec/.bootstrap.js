process.env.NODE_ENV = 'test';
process.env.AUTH_KEY = require('fs').readFileSync('./tests/resources/public.pem');

global.sinon = require('sinon');
require('sinon-as-promised');

var chai = require('chai');

chai.use(require('sinon-chai'));
chai.use(require('chai-as-promised'));

global.expect = chai.expect;
global.should = chai.should();
