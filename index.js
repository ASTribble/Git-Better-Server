require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const {PORT, CLIENT_ORIGIN, DATABASE_URL} = require('./config');
const {dbConnect} = require('./db-mongoose');
const app = express();

const {router: userRouter} = require('./users/router');
const {router: authRouter} = require('./auth/router');
const {router: questionRouter} = require('./questions/router');
const {localStrategy, jwtStrategy} = require('./auth/strategies');


app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test',
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN,
  })
);

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

const jwtAuth = passport.authenticate('jwt', {session: false});

app.get('/api/protected', jwtAuth, (req, res) => {
  return res.json({text: 'What is the meaning of life?', answer: 42});
});

app.use('/api/questions', jwtAuth, questionRouter);

// function runServer(port = PORT) {
//   const server = app
//     .listen(port, () => {
//       console.info(`App listening on port ${server.address().port}`);
//     })
//     .on('error', (err) => {
//       console.error('Express failed to start');
//       console.error(err);
//     });
// }


// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, { useMongoClient: true }, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        console.error(err);
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}



if (require.main === module) {
  // dbConnect();
  runServer().catch(err => console.error(err));
}

module.exports = {runServer, app, closeServer};
