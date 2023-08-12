import { addHours, format } from "date-fns";
import { ja } from "date-fns/locale";

interface DateFormatProps {
  props: string;
}

export const DateFormat = ({ props }: DateFormatProps) => {
  const date = new Date(props);
  const jaDateTime = addHours(date, 9);

  return (
    <time dateTime={new Date(date).toISOString()}>
      {format(jaDateTime, "yyyy年MM月dd日 HH:mm", { locale: ja })}
    </time>
  );
};
