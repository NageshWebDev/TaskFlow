import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

async function register(email: string) {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ email, password: 'secret12' });
  return res.body.data.token as string;
}

describe('Ownership enforcement', () => {
  it('user B cannot read or modify user A project or task', async () => {
    const tokenA = await register('owner@example.com');
    const tokenB = await register('other@example.com');

    const projectRes = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ name: 'A Project', description: 'private' });
    expect(projectRes.status).toBe(201);
    const projectId = projectRes.body.data.id as string;

    const taskRes = await request(app)
      .post(`/api/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        title: 'Secret task',
        dueDate: new Date().toISOString(),
      });
    expect(taskRes.status).toBe(201);
    const taskId = taskRes.body.data.id as string;

    const getProject = await request(app)
      .get(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${tokenB}`);
    expect(getProject.status).toBe(404);

    const updateProject = await request(app)
      .patch(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ name: 'Hijacked' });
    expect(updateProject.status).toBe(404);

    const getTask = await request(app)
      .get(`/api/projects/${projectId}/tasks/${taskId}`)
      .set('Authorization', `Bearer ${tokenB}`);
    expect(getTask.status).toBe(404);

    const updateTask = await request(app)
      .patch(`/api/projects/${projectId}/tasks/${taskId}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ status: 'Done' });
    expect(updateTask.status).toBe(404);

    const deleteTask = await request(app)
      .delete(`/api/projects/${projectId}/tasks/${taskId}`)
      .set('Authorization', `Bearer ${tokenB}`);
    expect(deleteTask.status).toBe(404);
  });
});
