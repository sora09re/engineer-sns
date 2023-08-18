import { Button, Center } from "@mantine/core";

import { useModal } from "@/hooks/useModal";

interface ProfileActionsButtonProps {
  currentUserId: string;
  userId: string;
}

export const ProfileActionsButton = ({
  currentUserId,
  userId,
}: ProfileActionsButtonProps) => {
  const [, setIsVisible] = useModal("editProfile");
  const isFollowing = true; // この部分は実際のロジックに基づいて変更する必要があります。

  const handleFollow = () => {
    alert("フォロー機能を実装");
  };

  const handleRemoveFollow = () => {
    alert("フォロー機能を実装");
  };

  return (
    <Center>
      {currentUserId === userId ? (
        <Button
          variant="outline"
          color="dark"
          onClick={() => {
            return setIsVisible(true);
          }}
        >
          プロフィールを編集
        </Button>
      ) : isFollowing ? (
        <Button variant="outline" color="dark" onClick={handleFollow}>
          フォロー中
        </Button>
      ) : (
        <Button onClick={handleRemoveFollow}>フォロー</Button>
      )}
    </Center>
  );
};
