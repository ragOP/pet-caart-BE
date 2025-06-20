const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');

const NODE_ENV = process.env.NODE_ENV;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pet Caart API',
      version: '1.0.0',
      description: 'API documentation for Pet Caart',
    },
    servers: [
      {
        url: process.env.API_URL,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [path.resolve(__dirname, '../../routes/**/*.js')],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
