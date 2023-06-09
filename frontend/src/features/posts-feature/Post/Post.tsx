import { Flex, Group, Paper, Space, Text } from "@mantine/core";
import { IconMessageCircle2, IconRotate, IconThumbUp } from "@tabler/icons";
import { useEffect, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { monokaiSublime } from "react-syntax-highlighter/dist/cjs/styles/hljs";

import { useModal } from "@/hooks/useModal";

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
  const [likes, setLikes] = useState(post ? post.likes : 0);
  const [liked, setLiked] = useState(false);

  const [, setIsVisible] = useModal("comment");

  useEffect(() => {
    if (post) {
      setLikes(post.likes);
    }
  }, [post]);

  const handleLikeClick = () => {
    setLikes(liked ? likes - 1 : likes + 1);
    setLiked(!liked);
  };

  if (!post) {
    return null;
  }

  const parsedContent = parseContent(post.content);

  return (
    <Paper key={post.id} p="md" shadow="xs" style={{ marginBottom: "20px" }}>
      {parsedContent.map((part, index) => {
        return <ContentPart key={index} part={part} />;
      })}
      <Space h="md" />
      <Group spacing="xl">
        <Flex align="center">
          <IconMessageCircle2
            size="1.2rem"
            cursor="pointer"
            onClick={() => {
              return setIsVisible(true);
            }}
          />
          <Space w="xs" />
          <Text>{post.comments}</Text>
        </Flex>
        <Flex align="center">
          <IconRotate size="1.2rem" cursor="pointer" />
          <Space w="xs" />
          <Text>{post.reposts}</Text>
        </Flex>
        <Flex align="center">
          <IconThumbUp
            size="1.2rem"
            color={liked ? "#228be6" : "black"}
            cursor="pointer"
            onClick={handleLikeClick}
          />
          <Space w="xs" />
          <Text>{likes}</Text>
        </Flex>
      </Group>
    </Paper>
  );
};
