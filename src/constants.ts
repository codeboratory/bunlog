import type { Level, Params } from "types";

export const STYLES = {
	DEBUG: "\x1b[34m",
	INFO: "\x1b[0m",
	WARN: "\x1b[33m",
	ERROR: "\x1b[31m",
} satisfies Record<Level, string>;

export const ICONS = {
	DEBUG: "•",
	INFO: "ℹ",
	WARN: "!",
	ERROR: "×",
} satisfies Record<Level, string>;

export const LEVEL_PRIORITY = {
	DEBUG: 0,
	INFO: 1,
	WARN: 2,
	ERROR: 3,
} satisfies Record<Level, number>;

export const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
	dateStyle: "short",
	timeStyle: "medium",
});

export const FORMATTER_DEFAULT = ({
	timestamp,
	context,
	level,
	message,
	data,
}: Params) =>
	`${DATE_FORMATTER.format(new Date(timestamp))} [${context}] ${level}: ${message}${data ? ` | ${data}` : ""}`;
