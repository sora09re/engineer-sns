import { Text } from "@mantine/core";
import SyntaxHighlighter from "react-syntax-highlighter";
import { monokaiSublime } from "react-syntax-highlighter/dist/esm/styles/hljs";

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
