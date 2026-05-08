import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Product & Auth API',
            version: '1.0.0',
            description: 'Dokumentasi API untuk sistem produk dan autentikasi pengguna',
            contact: {
                name: 'Dev Team',
                email: 'dev@yourdomain.com'
            }
        },
        servers: [
            {
                url: process.env.BASE_URL || 'http://localhost:5000',
                description: 'Development Server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Masukkan token JWT: `Bearer <token>`'
                }
            },
            schemas: {
                // Reusable schemas
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        username: { type: 'string', example: 'johndoe' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                Product: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'Laptop Gaming' },
                        image: { type: 'string', example: 'abc123.jpg' },
                        url: { type: 'string', format: 'uri', example: 'http://localhost:5000/images/abc123.jpg' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Terjadi kesalahan' }
                    }
                }
            }
        },
        security: [{ bearerAuth: [] }] // Default security (bisa di-override per endpoint)
    },
    // Pattern untuk file yang mengandung komentar @swagger
    apis: [
        './controllers/*.js',
        './routes/*.js'
    ]
};

export default swaggerJsdoc(options);
