const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');

const createError = require('http-errors');

const routes = require('./routes');

const UserId = require('./services/usersImp');
const Userdb = require('./services/dbImp');

const userId = new UserId('./data/users.json');
const userdb = new Userdb('./data/db.json');

const app = express();

const port = 3000;

app.set('trust proxy', 1);
app.use(
	cookieSession({
		name: 'session',
		keys: ['dkjfeosfjkjeb930s93', 'heisoefof938h53n'],
	})
);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(express.static(path.join(__dirname, './dashboard')));

// app.use((req, res, next) => {
// 	res.locals.register = 'registration';
// });

app.use(
	'/',
	routes({
		userdb,
		userId,
	})
);

app.use((req, res, next) => {
	return next(createError(404, 'file Not Found'));
});

app.use((err, req, res, next) => {
	res.locals.message = err.message;
	const status = err.status || 500;
	res.locals.status = status;
	res.status(status);
	res.render('error');
});

app.listen(port, () => {
	console.log(`Express listenin ${port}!`);
});
