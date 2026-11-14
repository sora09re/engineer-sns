import { deleteTestAccounts, SERVICE_ROLE_KEY_ENV, supabaseEnv } from "./support/supabase";
import { createVrtFixtures, VRT_PASSWORDS_ENV } from "./support/vrt-fixtures";

/** 前回のテストアカウントを消し、VRT 用の固定データを作り直す */
export default async function globalSetup() {
	// supabase status はここで 1 回だけ呼び、ワーカーには環境変数で渡す
	process.env[SERVICE_ROLE_KEY_ENV] = supabaseEnv().serviceRoleKey;
	await deleteTestAccounts();
	const { alice, newbie } = await createVrtFixtures();
	// global setup で設定した環境変数はワーカーにも引き継がれる
	process.env[VRT_PASSWORDS_ENV] = JSON.stringify({
		[alice.email]: alice.password,
		[newbie.email]: newbie.password,
	});
}
