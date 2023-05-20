import { Button as MantineButton } from "@mantine/core";
import { MantineProvider } from "@mantine/core";

const Button = () => {
  return (
    <MantineProvider>
      <MantineButton>投稿する</MantineButton>
    </MantineProvider>
  );
};

export default Button;
