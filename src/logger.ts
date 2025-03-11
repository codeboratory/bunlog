import type { Statement } from "bun:sqlite";
import { FORMATTER_DEFAULT, LEVEL_PRIORITY, STYLES } from "./constants.ts";
import type { Level, LogFunction, Logger, Settings } from "./types.ts";
import { stringify } from "./utils.ts";

export function createLogger(settings: Settings): Logger {
	const database = settings.database;
	const formatter = settings.formatter ?? FORMATTER_DEFAULT;
	const table_name = settings.table_name ?? "logger";
	const min_level = settings.min_level ?? "DEBUG";

	database.exec(`
		CREATE TABLE IF NOT EXISTS ${table_name} (
			timestamp INTEGER NOT NULL,
			context TEXT NOT NULL,
			level TEXT NOT NULL,
			message TEXT NOT NULL,
			data TEXT NOT NULL,
			count INTEGER DEFAULT 1,
			PRIMARY KEY (timestamp, context, level, message, data)
		);

		CREATE INDEX IF NOT EXISTS ${table_name}_timestamp_idx ON ${table_name}(timestamp);
		CREATE INDEX IF NOT EXISTS ${table_name}_context_idx ON ${table_name}(context);
		CREATE INDEX IF NOT EXISTS ${table_name}_level_idx ON ${table_name}(level);
	`);

	const $insert: Statement = database.prepare(`
		INSERT INTO ${table_name} (timestamp, context, level, message, data) 
		VALUES ($timestamp, $context, $level, $message, $data)
		ON CONFLICT(timestamp, context, level, message, data) 
		DO UPDATE SET count = count + 1;
	`);

	const log =
		(level: Level): LogFunction =>
		(context: string, message: string, data?: unknown) => {
			if (LEVEL_PRIORITY[level] < LEVEL_PRIORITY[min_level]) {
				return;
			}

			const params = {
				timestamp: Date.now(),
				context,
				level,
				message,
				data: data ? stringify(data) : "",
			};

			$insert.run({
				$timestamp: params.timestamp,
				$context: params.context,
				$level: params.level,
				$message: params.message,
				$data: params.data,
			});

			console.log(`${STYLES[level]}${formatter(params)}${STYLES.INFO}`);
		};

	return {
		debug: log("DEBUG"),
		info: log("INFO"),
		warn: log("WARN"),
		error: log("ERROR"),
	};
}
