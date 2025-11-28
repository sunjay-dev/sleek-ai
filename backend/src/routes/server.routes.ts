import { Hono } from 'hono';
import { handleHealthRoute, handleHomeRoute, handlePrometheusMatrics } from '../controllers/server.controllers';
import { prometheusAuth } from '../middlewares/auth.middlewares';

const router = new Hono();

router.get('/', handleHomeRoute);
router.get('/health', handleHealthRoute);
router.get('/metrics', prometheusAuth, handlePrometheusMatrics);

export default router;