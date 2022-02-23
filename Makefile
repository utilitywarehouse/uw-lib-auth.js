.DEFAULT: test

test: test-spec test-functional

test-spec:
	./node_modules/.bin/mocha -r tests/spec/.bootstrap.js tests/spec/

test-functional:
	./node_modules/.bin/mocha -r tests/spec/.bootstrap.js tests/functional/

lint:
	./node_modules/.bin/eslint --fix . && ./node_modules/.bin/prettier --write './**/*.js'

example:
	cd examples && yarn install
	cd examples && node express
