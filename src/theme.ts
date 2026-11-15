import { ActionIcon, Avatar, Menu, createTheme, type MantineColorsTuple } from "@mantine/core";

/**
 * Mantine 6 から 9 で既定値が変わったところのうち、v6 の見た目を残すもの。
 * 見た目を変えるときは、ここを直してから VRT のベースラインを更新する。
 */

// v9 で色味が変わった（青みのない灰色になった）ので、v6 の dark を使う
const dark: MantineColorsTuple = [
	"#C1C2C5",
	"#A6A7AB",
	"#909296",
	"#5c5f66",
	"#373A40",
	"#2C2E33",
	"#25262b",
	"#1A1B1E",
	"#141517",
	"#101113",
];

export const theme = createTheme({
	colors: { dark },
	defaultRadius: "sm",
	// v9 で xl が 24px → 32px になった
	spacing: { xl: "1.5rem" },
	components: {
		// v6 の既定は subtle
		ActionIcon: ActionIcon.extend({ defaultProps: { variant: "subtle", color: "gray" } }),
		// v9 の Avatar は defaultRadius に関係なく丸い。v6 は sm
		Avatar: Avatar.extend({ defaultProps: { radius: "sm" } }),
		// v9 はドロップダウンを画面端から 5px 離す。v6 は端まで寄せていた
		Menu: Menu.extend({ defaultProps: { middlewares: { shift: { padding: 0 } } } }),
	},
});
