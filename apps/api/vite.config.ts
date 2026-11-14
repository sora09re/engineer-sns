import { defineConfig, loadEnv } from "vite-plus";

export default defineConfig(({ mode }) => {
	return {
		test: {
			environment: "node",
			// .env.local の DATABASE_URL などをテストに渡す
			env: loadEnv(mode, process.cwd(), ""),
			// 同じ DB を使うので、ファイルを並列に動かさない
			fileParallelism: false,
		},
	};
});
