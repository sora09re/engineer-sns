// Vercel Functions（Node.js ランタイム）の入口。/api/* はすべてここに届く（vercel.json の rewrites）
import { createAppFromEnv } from "@engineer-sns/api";
import { handle } from "hono/vercel";

const handler = handle(createAppFromEnv());

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
