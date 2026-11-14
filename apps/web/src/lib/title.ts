/** ページタイトル。旧 Next.js の title.template ("%s | Engineer-SNS") と同じ形式 */
export const pageTitle = (title: string) => {
	return { meta: [{ title: `${title} | Engineer-SNS` }] };
};
