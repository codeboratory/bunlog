import type { Level, LogFunctionName } from "types";
import type { Log } from "./types.ts";

export const LEVEL_MAP = {
	INFO: "info",
	WARN: "warn",
	DEBUG: "debug",
	ERROR: "error",
} satisfies Record<Level, LogFunctionName>;

export const NOW = 1741688948416;

export const LOGS: Log[] = [
	{
		timestamp: NOW,
		level: "INFO",
		context: "test",
		message: "hello",
		data: { a: 1 },
	},
	{
		timestamp: NOW,
		level: "WARN",
		context: "test",
		message: "hello",
		data: 1,
	},
	{
		timestamp: NOW,
		level: "DEBUG",
		context: "test",
		message: "hello",
		data: new Map(),
	},
	{
		timestamp: NOW,
		level: "ERROR",
		context: "test",
		message: "hello",
		data: () => {},
	},
];
