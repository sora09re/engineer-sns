import { createAppFromEnv } from "@engineer-sns/api";
import { handle } from "hono/vercel";

const handler = handle(createAppFromEnv());

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
