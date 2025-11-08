import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

app.use('*', cors());

app.get('/', (c) => c.text('Hello, Hono!', 200));
app.get('/health', (c) => c.text('OK', 200));

import chatRouter from './routes/chat.routes';
import clerkRouter from './routes/clerk.routes';

app.route('/api/chat', chatRouter);
app.route('/api/clerk', clerkRouter);

export default app;