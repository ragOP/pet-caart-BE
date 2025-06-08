const fs = require('fs');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const logrotate = require('logrotate-stream');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger/index');
const ApiResponse = require('./utils/apiResponse');
const logrotateStream = require('logrotate-stream');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
console.log(swaggerSpec.paths);

// Set up logging with Morgan
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  const logDir = path.join(__dirname, 'logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
  const accessLogStream = logrotate({
    file: path.join(logDir, 'access.log'),
    size: '10M',
    keep: 3,
    compress: true,
  });

  app.use(morgan('combined', { stream: accessLogStream }));
}

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the cove API');
});

app.use('/api/user', require('./routes/users/index'));
app.use('/api/auth', require('./routes/auth/index'));

// 404 Not Found Middleware
app.use((req, res, next) => {
  return res
    .status(200)
    .json(new ApiResponse(404, null, `Route ${req.originalUrl} not found`, null));
});

module.exports = app;