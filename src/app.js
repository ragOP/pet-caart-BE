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
  res.send('Welcome to the Pet Caart API');
});

app.use('/api/users', require('./routes/users/index'));
app.use('/api/auth/user', require('./routes/auth/user/index'));
app.use('/api/auth/admin', require('./routes/auth/admin/index'));
app.use('/api/category', require('./routes/category/index'));
app.use('/api/subcategory', require('./routes/sub_category/index'));
app.use('/api/collection', require('./routes/collection/index'));
app.use('/api/breed', require('./routes/breed/index'));
app.use('/api/brand', require('./routes/brand/index'));
app.use('/api/product', require('./routes/product/index'));
app.use('/api/configuration', require('./routes/configuration/banner/index'));
app.use('/api/sliders', require('./routes/configuration/sliders/index'));
app.use('/api/settings', require('./routes/configuration/headerFooter/index'));
app.use('/api/cat-life-banner', require('./routes/configuration/catLifeBanner/index'));
app.use('/api/product-banner', require('./routes/configuration/productBanner/index'));
app.use('/api/address', require('./routes/address/index'));
app.use('/api/contact-us', require('./routes/contactUs/index'));
app.use('/api/hsn-code', require('./routes/hsn_code/index'));
app.use('/api/coupon', require('./routes/coupon/index'));
app.use('/api/cart', require('./routes/cart/index'));
app.use('/api/orders', require('./routes/orders/index'));
app.use('/api/blog', require('./routes/blog/index'));
app.use('/api/featured-blog-products', require('./routes/featured_blog_products/index'));
app.use('/api/news-letter', require('./routes/news_letter/index'));
app.use('/api/razorpay', require('./routes/payment/index'));
app.use('/api/otp', require('./routes/otp/index'));
app.use('/api/delivery', require('./routes/expected_delivery/index'));
app.use('/api/reviews', require('./routes/reviews/index'));

// 404 Not Found Middleware
app.use((req, res, next) => {
  return res
    .status(200)
    .json(new ApiResponse(404, null, `Route ${req.originalUrl} not found`, null));
});

module.exports = app;
