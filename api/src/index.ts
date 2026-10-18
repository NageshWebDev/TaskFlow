import { createApp } from './app';
import { connectDb } from './config/db';
import { env } from './config/env';

async function main() {
  await connectDb();
  const app = createApp();
  app.listen(env.port, () => {
    console.log(`TaskFlow API listening on http://localhost:${env.port}`);
    console.log(`Swagger docs at http://localhost:${env.port}/api/docs`);
  });
}

main().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
