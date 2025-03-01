import { Button, Center } from "@mantine/core";

import { FollowButton } from "@/components/FollowButton/FollowButton";
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
  const isCurrentUser = currentUserId === userId;

  return (
    <Center>
      {isCurrentUser ? (
        <Button
          variant="outline"
          color="dark"
          onClick={() => {
            return setIsVisible(true);
          }}
        >
          プロフィールを編集
        </Button>
      ) : (
        <FollowButton currentUserId={currentUserId} userId={userId} />
      )}
    </Center>
  );
};
