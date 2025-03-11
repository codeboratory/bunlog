import { resolve } from "node:path";
import { defineConfig } from "rolldown";

const paths = {
	alias: {
		types: resolve("src/types.ts"),
		const: resolve("src/constants.ts"),
		utils: resolve("src/utils.ts"),
		logger: resolve("src/logger.ts"),
	},
};

export default defineConfig([
	{
		input: "src/index.ts",
		output: {
			format: "esm",
			file: "dist/index.js",
			preserveModules: true,
		},
		resolve: paths,
	},
	{
		input: "src/index.ts",
		output: {
			format: "cjs",
			file: "dist/index.cjs",
			preserveModules: true,
		},
		resolve: paths,
	},
]);
