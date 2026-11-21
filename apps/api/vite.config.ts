import { defineConfig, loadEnv } from "vite-plus";

export default defineConfig(({ mode }) => {
	return {
		test: {
			environment: "node",
			env: loadEnv(mode, process.cwd(), ""),
			fileParallelism: false,
		},
	};
});
