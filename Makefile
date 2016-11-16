.DEFAULT: test

test: test-spec test-functional

test-spec:
	./node_modules/.bin/mocha -r tests/spec/.bootstrap.js --compilers js:babel-core/register tests/spec/

test-functional:
	./node_modules/.bin/mocha -r tests/spec/.bootstrap.js --compilers js:babel-core/register tests/functional/

example:
	cd examples && npm install
	cd examples && node express
