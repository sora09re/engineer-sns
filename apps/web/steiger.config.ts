import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

// FSD の層・公開 API・スライスの使われ方を検査する（docs/adr/0003）
export default defineConfig([...fsd.configs.recommended]);
