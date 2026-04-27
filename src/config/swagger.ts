import path from 'node:path';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Kelasi API',
            version: '1.0.0',
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
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
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [
        path.join(process.cwd(), 'src/routes/*.ts'),
        path.join(process.cwd(), 'dist/routes/*.js'),
    ],
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };