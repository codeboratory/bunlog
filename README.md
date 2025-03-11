# 🪵 bunlog

**SQLite-powered logging for Bun that just works.**

```ts
import { createLogger } from "bunlog";
import { Database } from "bun:sqlite";

const database = new Database("logs.sqlite");
const logger = createLogger({ database });

logger.info("app", "Server started", { port: 3000 });
logger.warn("auth", "Login attempt failed", { username: "sus_user" });
logger.error("db", "Connection failed", { error: "timeout" });
```

## Features

- 🔋 **Minimal but mighty**: Four log levels (`debug`, `info`, `warn`, `error`)
- 💾 **Persistent**: All logs stored in SQLite
- 🎨 **Customizable**: Bring your own formatter and table name
- 🚀 **Fast**: Uses prepared statements for efficient logging
- 🧩 **Zero dependencies**: Just Bun and its SQLite API

## Usage

```ts
// Create a logger with custom options
const logger = createLogger({
  database: db,            // Required: Your SQLite database
  min_level: "INFO",       // Optional: Filter out DEBUG logs
  table_name: "app_logs",  // Optional: Custom table name
  formatter: (params) => `[${params.level}] ${params.message}` // Optional: Custom format
});
```

## Philosophy

"Bring your own batteries" - We handle the logging, you decide what to do with the data:

*Your logs deserve better than console.log() - but they don't need a complicated solution either.*
