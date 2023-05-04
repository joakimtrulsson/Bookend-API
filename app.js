const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const bookRouter = require('./routes/bookRoutes');
const authorRouter = require('./routes/authorRoutes');
const genreRouter = require('./routes/genreRoutes');

const app = express();

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP. Please try again in a hour.',
});

app.enable('trust proxy');

// Globala Middleware

app.use(
  cors({
    origin: 'http://localhost:8001',
    credentials: true,
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(helmet());

app.use('/api', limiter);

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Data sanitering mot XSS.
app.use(xss());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.use('/api/book', bookRouter);
app.use('/api/author', authorRouter);
app.use('/api/genre', genreRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
