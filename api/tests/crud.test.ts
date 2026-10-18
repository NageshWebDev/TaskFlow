import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('Full CRUD flow', () => {
  it('creates, updates, filters and deletes project and tasks', async () => {
    const auth = await request(app)
      .post('/api/auth/register')
      .send({ email: 'flow@example.com', password: 'secret12' });
    const token = auth.body.data.token as string;
    const authHeader = { Authorization: `Bearer ${token}` };

    const project = await request(app)
      .post('/api/projects')
      .set(authHeader)
      .send({ name: 'Launch', description: 'Ship TaskFlow' });
    expect(project.status).toBe(201);
    const projectId = project.body.data.id as string;

    const task1 = await request(app)
      .post(`/api/projects/${projectId}/tasks`)
      .set(authHeader)
      .send({
        title: 'Write API',
        description: 'Express CRUD',
        status: 'In Progress',
        priority: 'High',
        dueDate: new Date(Date.now() + 86400000).toISOString(),
      });
    expect(task1.status).toBe(201);

    const task2 = await request(app)
      .post(`/api/projects/${projectId}/tasks`)
      .set(authHeader)
      .send({
        title: 'Write UI',
        status: 'To Do',
        priority: 'Medium',
        dueDate: new Date(Date.now() - 86400000).toISOString(),
      });
    expect(task2.status).toBe(201);
    const task2Id = task2.body.data.id as string;

    const done = await request(app)
      .patch(`/api/projects/${projectId}/tasks/${task2Id}`)
      .set(authHeader)
      .send({ status: 'Done' });
    expect(done.status).toBe(200);
    expect(done.body.data.status).toBe('Done');

    const filtered = await request(app)
      .get(`/api/projects/${projectId}/tasks`)
      .query({ status: 'In Progress', priority: 'High', search: 'API' })
      .set(authHeader);
    expect(filtered.status).toBe(200);
    expect(filtered.body.data).toHaveLength(1);
    expect(filtered.body.data[0].title).toBe('Write API');

    const dashboard = await request(app).get('/api/dashboard').set(authHeader);
    expect(dashboard.status).toBe(200);
    expect(dashboard.body.data.totalProjects).toBe(1);
    expect(dashboard.body.data.totalTasks).toBe(2);
    expect(dashboard.body.data.completedTasks).toBe(1);

    const listed = await request(app).get('/api/projects').set(authHeader);
    expect(listed.body.data[0].taskCount).toBe(2);
    expect(listed.body.data[0].completionPercent).toBe(50);

    await request(app)
      .delete(`/api/projects/${projectId}/tasks/${task2Id}`)
      .set(authHeader)
      .expect(200);

    await request(app)
      .delete(`/api/projects/${projectId}`)
      .set(authHeader)
      .expect(200);

    const gone = await request(app)
      .get(`/api/projects/${projectId}`)
      .set(authHeader);
    expect(gone.status).toBe(404);
  });
});
