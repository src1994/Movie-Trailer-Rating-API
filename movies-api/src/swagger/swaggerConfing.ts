import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';


const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Movie Trailer Rating API',
        version: '1.0.0',
        description: 'API documentation for Movie Trailer Rating application',
        contact: {
          name: 'Sérgio Sousa',
          email: 'sousamultimedia@gmail.com'
        }
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server'
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        },
        schemas: {
          Movie: {
            type: 'object',
            properties: {
              title: {
                type: 'string',
                example: 'Inception'
              },
              releaseDate: {
                type: 'string',
                format: 'date',
                example: '2010-07-16'
              },
              trailerLink: {
                type: 'string',
                example: 'https://www.youtube.com/watch?v=YoHD9XEInc0'
              },
              posterUrl: {
                type: 'string',
                example: 'poster-name.jpg'
              },
              genres: {
                type: 'array',
                items: {
                  type: 'string',
                  example: 'Action'
                }
              }
            }
          },
          User: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                description: 'User ID',
                example: '60d21b4667d0d8992e610c85'
              },
              name: {
                type: 'string',
                description: 'User full name',
                example: 'John Doe'
              },
              email: {
                type: 'string',
                description: 'User email address',
                example: 'john.doe@example.com'
              },
              role: {
                type: 'string',
                description: 'User role',
                enum: ['USER', 'ADMIN'],
                example: 'USER'
              }
            },
            required: ['id', 'name', 'email', 'role']
          }
        }
      }
    },
    apis: ['./src/routers/*.ts', './src/models/*.ts']
  };
  
const swaggerDocs = swaggerJSDoc(swaggerOptions);

export default function swaggerDocsSetup(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}
