import { Hono } from 'hono';
import { cors } from 'hono/cors';
const app = new Hono();

app.use('*', cors());

import serverRoutes from './routes/server.routes.js';
import chatRouter from './routes/chat.routes.js';
import clerkRouter from './routes/clerk.routes.js';

app.route('/', serverRoutes);
app.route('/api/chat', chatRouter);
app.route('/api/clerk', clerkRouter);

export default app;