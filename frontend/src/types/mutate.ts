import type { MutatorCallback } from "swr";

export type MutateFunction<T> = (
  data?: T | Promise<T | undefined> | MutatorCallback<T | undefined>,
  shouldRevalidate?: boolean
) => Promise<T | undefined>;
