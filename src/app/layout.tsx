import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
	title: {
		template: "%s | Engineer-SNS",
		default: "Engineer-SNS",
	},
	description: "エンジニアのアウトプットのためのSNSアプリです。",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ja">
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
