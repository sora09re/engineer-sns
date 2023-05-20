import { Button, Col, Container, Paper, Text, Textarea } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

const tweets = [
  {
    id: 1,
    content: "Hello, world! This is a tweet.",
  },
  {
    id: 2,
    content: "Here's another tweet.",
  },
  // 他のツイート...
];
const HomePage = () => {
  return (
    <NotificationsProvider>
      <Container>
        <Col span={8} offset={2}>
          <Paper p="md" shadow="xs" style={{ marginBottom: "20px" }}>
            <Textarea
              placeholder="What's happening?"
              minRows={3}
              maxRows={10}
            />
            <Button fullWidth>Tweet</Button>
          </Paper>

          {tweets.map((tweet) => {
            return (
              <Paper
                key={tweet.id}
                p="md"
                shadow="xs"
                style={{ marginBottom: "20px" }}
              >
                <Text>{tweet.content}</Text>
              </Paper>
            );
          })}
        </Col>
      </Container>
    </NotificationsProvider>
  );
};

export default HomePage;
