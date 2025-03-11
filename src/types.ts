import type { Database } from "bun:sqlite";

export type Level = "DEBUG" | "INFO" | "WARN" | "ERROR";

export type Params = {
	timestamp: number;
	context: string;
	level: Level;
	message: string;
	data: string;
};

export type Formatter = (params: Params) => string;

export type Settings = {
	database: Database;
	formatter?: Formatter;
	table_name?: string;
	min_level?: Level;
};

export type LogFunction = (
	context: string,
	message: string,
	data?: unknown,
) => void;

export type LogFunctionName = "debug" | "info" | "warn" | "error";

export type Logger = {
	info: LogFunction;
	warn: LogFunction;
	debug: LogFunction;
	error: LogFunction;
};
