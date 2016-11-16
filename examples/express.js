const express = require('express');
const path = require('path');
const app = express();

const authModule = require('./..');

const auth = new authModule.Provider([
	new authModule.Method.oAuth2JWT({
		key: authModule.Key.fromFile(path.join(__dirname, '../tests/resources/public.pem')),
		algo: [authModule.Key.RS256]
	})
]);

app.use(auth.middleware());

app.get('/:id', /*auth.middleware.scope('partner.:id.read'),*/ function (req, res) {
  res.json({auth: req.auth});
});

app.use((error, req, res, next) => {
	res.status(error.status).json(error);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
