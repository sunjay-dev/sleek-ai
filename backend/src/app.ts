import { Hono } from 'hono';
import { askAI, listModels } from './config/groq.config';
import { cors } from 'hono/cors';

const app = new Hono();

app.use('*', cors());

app.get('/', (c) => c.text('Hello, Hono!'));

app.post('/chat', async (c) => {
    const { query, model = 'gpt-oss-120b' } = await c.req.json();
    const response = await askAI(query, model);
    return c.json({ response, isAI: true });
});

app.get('/getModels', async (c) => {
    const models = await listModels();
    return c.json({ models });
});

export default app;