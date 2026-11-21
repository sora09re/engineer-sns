import { deleteTestAccounts, SERVICE_ROLE_KEY_ENV, supabaseEnv } from "./support/supabase";
import { createVrtFixtures, VRT_PASSWORDS_ENV } from "./support/vrt-fixtures";

export default async function globalSetup() {
	process.env[SERVICE_ROLE_KEY_ENV] = supabaseEnv().serviceRoleKey;
	await deleteTestAccounts();
	const { alice, newbie } = await createVrtFixtures();
	process.env[VRT_PASSWORDS_ENV] = JSON.stringify({
		[alice.email]: alice.password,
		[newbie.email]: newbie.password,
	});
}
