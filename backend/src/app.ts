import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

app.use('*', cors());

app.get('/', (c) => c.text('Hello, Hono!'));

import chatRouter from './routes/chat.routes';

app.route('/api/chat', chatRouter);

export default app;