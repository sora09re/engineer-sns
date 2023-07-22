import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface DateFormatProps {
  props: string;
}

export const DateFormat = ({ props }: DateFormatProps) => {
  const date = new Date(props);
  return (
    <time dateTime={new Date(date).toISOString()}>
      {format(date, "yyyy年MM月dd日 hh:mm", { locale: ja })}
    </time>
  );
};
