import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface DateFormatProps {
	props: Date | string;
}

/** ブラウザのローカルタイムで表示する（timestamptz を受け取る前提） */
export const DateFormat = ({ props }: DateFormatProps) => {
	const date = new Date(props);

	return (
		<time dateTime={date.toISOString()}>
			{format(date, "yyyy年MM月dd日 HH:mm", { locale: ja })}
		</time>
	);
};
