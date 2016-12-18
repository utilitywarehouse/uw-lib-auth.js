.DEFAULT: test

test: test-spec test-functional

test-spec:
	./node_modules/.bin/mocha -r tests/spec/.bootstrap.js tests/spec/

test-functional:
	./node_modules/.bin/mocha -r tests/spec/.bootstrap.js tests/functional/

lint:
	./node_modules/.bin/xo index.js

example:
	cd examples && npm install
	cd examples && node express
