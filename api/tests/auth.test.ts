import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('Auth', () => {
  it('registers and logs in a user', async () => {
    const register = await request(app)
      .post('/api/auth/register')
      .send({ email: 'alice@example.com', password: 'secret12' });

    expect(register.status).toBe(201);
    expect(register.body.success).toBe(true);
    expect(register.body.data.token).toBeDefined();
    expect(register.body.data.user.email).toBe('alice@example.com');

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'alice@example.com', password: 'secret12' });

    expect(login.status).toBe(200);
    expect(login.body.data.token).toBeDefined();
  });

  it('rejects duplicate registration', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'dup@example.com', password: 'secret12' });

    const again = await request(app)
      .post('/api/auth/register')
      .send({ email: 'dup@example.com', password: 'secret12' });

    expect(again.status).toBe(409);
    expect(again.body.success).toBe(false);
  });

  it('invalidates token on logout', async () => {
    const { body } = await request(app)
      .post('/api/auth/register')
      .send({ email: 'out@example.com', password: 'secret12' });

    const token = body.data.token as string;

    const logout = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`);
    expect(logout.status).toBe(200);

    const blocked = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${token}`);
    expect(blocked.status).toBe(401);
  });
});
