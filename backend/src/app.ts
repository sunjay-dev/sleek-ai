import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

app.use('*', cors());

import serverRoutes from './routes/server.routes';
import chatRouter from './routes/chat.routes';
import clerkRouter from './routes/clerk.routes';

app.route('/', serverRoutes);
app.route('/api/chat', chatRouter);
app.route('/api/clerk', clerkRouter);

export default app;