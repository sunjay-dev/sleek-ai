import client from "prom-client";
import { backendEnv } from "./env.config.js";

const register = new client.Registry();
register.setDefaultLabels({ job: backendEnv.APP_JOB_NAME });
client.collectDefaultMetrics({ register });

export default register;
