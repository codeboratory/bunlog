import { Database } from "bun:sqlite";
import { afterEach, expect } from "bun:test";
import { STYLES } from "const";
import type { Formatter, Logger } from "types";
import { stringify } from "utils";
import { LEVEL_MAP, NOW } from "./constants.ts";
import type { Log } from "./types.ts";

export const createDatabase = () => new Database(":memory:");

export const tableExists = (database: Database, name: string) => {
	return Boolean(
		database
			.prepare(
				`SELECT name FROM sqlite_master WHERE type='table' AND name = $name`,
			)
			.get({ $name: name }),
	);
};
export const runLogs = (
	logger: Logger,
	formatter: Formatter,
	messages: string[],
	logs: Log[],
) => {
	for (let i = 0; i < logs.length; ++i) {
		const log = logs[i];

		logger[LEVEL_MAP[log.level]](log.context, log.message, log.data);

		expect(messages.length).toBe(i + 1);
		expect(messages[i]).toBe(
			`${STYLES[log.level]}${formatter({
				...log,
				data: log.data ? stringify(log.data) : "",
			})}${STYLES.INFO}`,
		);
	}
};

export const mockDateNow = () => {
	const timestamps: number[] = [];

	Date.now = () => {
		timestamps.push(NOW);
		return NOW;
	};

	return timestamps;
};

export const mockConsoleLog = () => {
	const messages: string[] = [];

	console.log = (message: string) => {
		messages.push(message);
	};

	return messages;
};

export const resetMocks = () => {
	const original_console_log = console.log;
	const original_date_now = Date.now;

	afterEach(() => {
		console.log = original_console_log;
		Date.now = original_date_now;
	});
};
