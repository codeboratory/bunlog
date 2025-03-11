import type { Params } from "types";

export type Log = Omit<Params, "data"> & { data: unknown };
