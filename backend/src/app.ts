import { Hono } from 'hono';
import { askAI } from './config/groq.config';
import { cors } from 'hono/cors';

const app = new Hono();

app.use('*', cors());

app.get('/', (c) => c.text('Hello, Hono!'));

app.post('/chat', async (c) => {
    const { query } = await c.req.json();
    const response = await askAI(query);

    return c.json({ response, isAI: true });
});

export default app;