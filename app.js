const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const {connectDb} = require('./lib/mongo.js')

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');


connectDb();

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', authRouter);
app.use('/users', usersRouter);


module.exports = app;
