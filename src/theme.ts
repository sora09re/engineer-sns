import { ActionIcon, CloseButton, createTheme, type MantineColorsTuple } from "@mantine/core";

/**
 * Mantine 6 から 9 で既定値が変わったところを、6 の見た目に戻す。
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
	// v9 はサイズごとに行間が違う。v6 はすべて 1.55
	lineHeights: { xs: "1.55", sm: "1.55", md: "1.55", lg: "1.55", xl: "1.55" },
	components: {
		// v6 の既定は subtle
		ActionIcon: ActionIcon.extend({ defaultProps: { variant: "subtle", color: "gray" } }),
		// v9 で 22px → 28px になった
		CloseButton: CloseButton.extend({ defaultProps: { size: "sm", iconSize: 16 } }),
	},
});
