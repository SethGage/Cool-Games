import './config'; // Load environment variables
import 'express-async-errors'; // Enable default error handling for async errors
import 'dataSource.ts';
import express, { Express } from 'express';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import { registerUser, Login, LogOut, UpdateEmail } from './controllers/UserController';

const app: Express = express();
const { PORT, COOKIE_SECRET } = process.env;

const SQLiteStore = connectSqlite3(session);

app.use(
  session({
    store: new SQLiteStore({ db: 'sessions.sqlite' }),
    secret: COOKIE_SECRET,
    cookie: { maxAge: 8 * 60 * 60 * 1000 }, // 8 hours
    name: 'session',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public', { extensions: ['html'] }));
app.set('view engine', 'ejs');

app.post('/api/updateEmail', UpdateEmail);
app.post('/api/register', registerUser);
app.post('/api/login', Login);
app.post('/api/logout', LogOut);

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
