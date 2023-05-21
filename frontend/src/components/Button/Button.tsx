import { Button as MantineButton, MantineProvider } from "@mantine/core";

export const Button = () => {
  return (
    <MantineProvider>
      <MantineButton>投稿する</MantineButton>
    </MantineProvider>
  );
};
