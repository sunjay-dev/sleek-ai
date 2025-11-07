import { getAuth } from '@hono/clerk-auth'
import { type Context } from 'hono'

export const checkUser = async (c: Context, next: () => Promise<void>) => {
  const auth = getAuth(c);
  if (!auth?.userId) return c.json({ message: 'Unauthorized' }, 401);
  await next();
}
