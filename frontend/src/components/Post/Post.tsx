import { Flex, Group, Paper, Space, Text } from "@mantine/core";
import { IconMessageCircle2, IconRotate, IconThumbUp } from "@tabler/icons";
import SyntaxHighlighter from "react-syntax-highlighter";
import { monokaiSublime } from "react-syntax-highlighter/dist/cjs/styles/hljs";

export type PostProps = {
  post: {
    id: number;
    comments: number;
    content: string;
    likes: number;
    reposts: number;
  };
};

type ParsedContent = { content: string; type: "text" | "code" };

type ContentPartProps = {
  part: ParsedContent;
};

const COMPONENT_MAP = {
  code: SyntaxHighlighter,
  text: Text,
};

export const parseContent = (content: string): ParsedContent[] => {
  const parts = content.split("```");

  return parts.map((part, index) => {
    return {
      content: part,
      type: index % 2 === 0 ? "text" : "code",
    };
  });
};

export const ContentPart: React.FC<ContentPartProps> = ({ part }) => {
  const Component = COMPONENT_MAP[part.type];

  if (part.type === "code") {
    return (
      <Component language="htmlbars" style={monokaiSublime}>
        {part.content}
      </Component>
    );
  }

  return <Component>{part.content}</Component>;
};

export const Post: React.FC<PostProps> = ({ post }) => {
  if (!post) {
    return null;
  }

  const parsedContent = parseContent(post.content);

  return (
    <Paper key={post.id} p="md" shadow="xs" style={{ marginBottom: "20px" }}>
      {parsedContent.map((part, index) => {
        return <ContentPart key={index} part={part} />;
      })}
      <Group spacing="xl">
        <Flex align="center">
          <IconMessageCircle2 size="1.0rem" stroke={1.0} cursor="pointer" />
          <Space w="xs" />
          <Text>{post.comments}</Text>
        </Flex>
        <Flex align="center">
          <IconRotate size="1.0rem" stroke={1.0} cursor="pointer" />
          <Space w="xs" />
          <Text>{post.reposts}</Text>
        </Flex>
        <Flex align="center">
          <IconThumbUp size="1.0rem" stroke={1.0} cursor="pointer" />
          <Space w="xs" />
          <Text>{post.likes}</Text>
        </Flex>
      </Group>
    </Paper>
  );
};
