import { describe, expect, test } from "bun:test";
import { FORMATTER_DEFAULT } from "const";
import { createLogger } from "logger";
import type { Params } from "types";
import { LEVEL_MAP, LOGS } from "./constants.ts";
import {
	createDatabase,
	mockConsoleLog,
	mockDateNow,
	resetMocks,
	runLogs,
	tableExists,
} from "./utils.ts";

describe("Logger", () => {
	resetMocks();

	describe("create", () => {
		test("default table", () => {
			const database = createDatabase();
			const logger = createLogger({ database });

			expect(logger.info).toBeDefined();
			expect(logger.warn).toBeDefined();
			expect(logger.debug).toBeDefined();
			expect(logger.error).toBeDefined();

			expect(tableExists(database, "logger"));
		});

		test("custom table", () => {
			const database = createDatabase();
			const logger = createLogger({ database, table_name: "custom_logger" });

			expect(logger.info).toBeDefined();
			expect(logger.warn).toBeDefined();
			expect(logger.debug).toBeDefined();
			expect(logger.error).toBeDefined();

			expect(tableExists(database, "custom_logger"));
		});
	});

	describe("log", () => {
		test("default formatter", () => {
			mockDateNow();

			const messages = mockConsoleLog();
			const database = createDatabase();
			const logger = createLogger({ database });

			runLogs(logger, FORMATTER_DEFAULT, messages, LOGS);
		});

		test("custom formatter", () => {
			mockDateNow();

			const messages = mockConsoleLog();
			const formatter = (_: Params) => "All logs are the same";
			const database = createDatabase();
			const logger = createLogger({ database, formatter });

			runLogs(logger, formatter, messages, LOGS);
		});

		test("min level", () => {
			mockDateNow();

			const min_level = "INFO";

			const messages = mockConsoleLog();
			const database = createDatabase();
			const logger = createLogger({ database, min_level });

			for (const params of LOGS) {
				logger[LEVEL_MAP[params.level]](
					params.context,
					params.message,
					params.data,
				);
			}

			expect(messages.length).toBe(3);
		});
	});
});
