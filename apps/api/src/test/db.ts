import { connect, type Db } from "../db/client";

const url = process.env.DATABASE_URL;
if (!url) {
	throw new Error("apps/api/.env.local に DATABASE_URL を設定してください。");
}
const { hostname } = new URL(url);
if (hostname !== "127.0.0.1" && hostname !== "localhost") {
	throw new Error(`API のテストはローカルの DB でのみ実行できます（DATABASE_URL=${url}）。`);
}

const { db } = connect(url);

class Rollback extends Error {}

/** テスト本体をトランザクションの中で動かし、最後にロールバックする。テスト同士でデータが混ざらない */
export const withRollback = async (body: (tx: Db) => Promise<void>) => {
	try {
		await db.transaction(async (tx) => {
			await body(tx);
			throw new Rollback();
		});
	} catch (error) {
		if (!(error instanceof Rollback)) {
			throw error;
		}
	}
};
