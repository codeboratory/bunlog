import type { Database, Statement } from "bun:sqlite";

export type Level = "INFO" | "WARN" | "DEBUG" | "ERROR";

export type Params = {
	timestamp: number;
	context: string;
	level: string;
	message: string;
	data: string;
};

export type Formatter = (params: Params) => string;

export type Settings = {
	database: Database;
	formatter?: Formatter;
	table_name?: string;
};

const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
	dateStyle: "short",
	timeStyle: "medium",
});

const FORMATTER_DEFAULT = ({
	timestamp,
	context,
	level,
	message,
	data,
}: Params) =>
	`${DATE_FORMATTER.format(new Date(timestamp))} [${context}] ${level}: ${message}${data ? ` | ${data}` : ""}`;

const stringify = (data: unknown) => {
	try {
		return JSON.stringify(data);
	} catch {
		return `${data}`;
	}
};

const STYLES = {
	INFO: "\x1b[0m",
	WARN: "\x1b[33m",
	DEBUG: "\x1b[34m",
	ERROR: "\x1b[31m",
} satisfies Record<Level, string>;

export function createLogger(settings: Settings) {
	const database = settings.database;
	const formatter = settings.formatter ?? FORMATTER_DEFAULT;
	const table_name = settings.table_name ?? "logger";

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
		(level: Level) => (context: string, message: string, data?: unknown) => {
			const params = {
				timestamp: Date.now(),
				context,
				level,
				message,
				data: data ? stringify(data) : "",
			};

			setImmediate(() => {
				console.log(STYLES[level], formatter(params), STYLES.INFO);
			});

			$insert.run({
				$timestamp: params.timestamp,
				$context: params.context,
				$level: params.level,
				$message: params.message,
				$data: params.data,
			});
		};

	return {
		info: log("INFO"),
		warn: log("WARN"),
		debug: log("DEBUG"),
		error: log("ERROR"),
	};
}
