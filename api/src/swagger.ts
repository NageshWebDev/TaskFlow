import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskFlow API',
      version: '1.0.0',
      description: 'Mini project-management API for the TaskFlow take-home',
    },
    servers: [{ url: '/api' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                message: { type: 'string' },
                details: {},
              },
            },
          },
        },
        Project: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            taskCount: { type: 'number' },
            completionPercent: { type: 'number' },
          },
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['To Do', 'In Progress', 'Done'] },
            priority: { type: 'string', enum: ['Low', 'Medium', 'High'] },
            dueDate: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    paths: {
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'User registered' },
            409: { description: 'Email already registered' },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string' },
                    password: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'JWT returned' },
            401: { description: 'Invalid credentials' },
          },
        },
      },
      '/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'Logout (invalidate JWT via tokenVersion)',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Logged out' } },
        },
      },
      '/projects': {
        get: {
          tags: ['Projects'],
          security: [{ bearerAuth: [] }],
          summary: 'List projects with task stats',
          responses: { 200: { description: 'OK' } },
        },
        post: {
          tags: ['Projects'],
          security: [{ bearerAuth: [] }],
          summary: 'Create project',
          responses: { 201: { description: 'Created' } },
        },
      },
      '/projects/{id}': {
        get: {
          tags: ['Projects'],
          security: [{ bearerAuth: [] }],
          summary: 'Get project',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: { 200: { description: 'OK' }, 404: { description: 'Not found' } },
        },
        patch: {
          tags: ['Projects'],
          security: [{ bearerAuth: [] }],
          summary: 'Update project',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: { 200: { description: 'OK' } },
        },
        delete: {
          tags: ['Projects'],
          security: [{ bearerAuth: [] }],
          summary: 'Delete project and its tasks',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: { 200: { description: 'Deleted' } },
        },
      },
      '/projects/{projectId}/tasks': {
        get: {
          tags: ['Tasks'],
          security: [{ bearerAuth: [] }],
          summary: 'List tasks (filter by status, priority, search title)',
          parameters: [
            { name: 'projectId', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'status', in: 'query', schema: { type: 'string' } },
            { name: 'priority', in: 'query', schema: { type: 'string' } },
            { name: 'search', in: 'query', schema: { type: 'string' } },
          ],
          responses: { 200: { description: 'OK' } },
        },
        post: {
          tags: ['Tasks'],
          security: [{ bearerAuth: [] }],
          summary: 'Create task',
          parameters: [
            { name: 'projectId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: { 201: { description: 'Created' } },
        },
      },
      '/projects/{projectId}/tasks/{taskId}': {
        get: {
          tags: ['Tasks'],
          security: [{ bearerAuth: [] }],
          summary: 'Get task',
          parameters: [
            { name: 'projectId', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'taskId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: { 200: { description: 'OK' } },
        },
        patch: {
          tags: ['Tasks'],
          security: [{ bearerAuth: [] }],
          summary: 'Update task (including status change)',
          parameters: [
            { name: 'projectId', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'taskId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: { 200: { description: 'OK' } },
        },
        delete: {
          tags: ['Tasks'],
          security: [{ bearerAuth: [] }],
          summary: 'Delete task',
          parameters: [
            { name: 'projectId', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'taskId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: { 200: { description: 'Deleted' } },
        },
      },
      '/dashboard': {
        get: {
          tags: ['Dashboard'],
          security: [{ bearerAuth: [] }],
          summary: 'Dashboard stats via aggregation',
          responses: { 200: { description: 'OK' } },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
