import type { MutatorCallback } from "swr";

export type MutateFunction<T> = (
  data?: T | Promise<T> | MutatorCallback<T>,
  shouldRevalidate?: boolean
) => Promise<T | undefined>;
