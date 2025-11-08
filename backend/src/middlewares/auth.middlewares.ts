import { getAuth } from '@hono/clerk-auth'
import type { Next, Context } from 'hono'

export const checkUser = async (c: Context, next: Next) => {
  const auth = getAuth(c);
  if (!auth?.userId) return c.json({ message: 'Unauthorized' }, 401);
  await next();
}
