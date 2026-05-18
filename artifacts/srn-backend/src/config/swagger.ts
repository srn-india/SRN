import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sashakt Rashtra Nirman (SRN) API',
      version: '1.0.0',
      description: 'API documentation for the SRN NGO platform',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
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
  apis: [
    './src/modules/**/*.ts',
    './src/index.ts',
    './dist/modules/**/*.js',
    './dist/index.js'
  ], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
