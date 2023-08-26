import { Button, Center } from "@mantine/core";
import type { KeyedMutator } from "swr";

import { FollowButton } from "@/components/FollowButton/FollowButton";
import { useModal } from "@/hooks/useModal";
import type { ProfileType } from "@/types/profile";

interface ProfileActionsButtonProps {
  currentUserId: string;
  mutate: KeyedMutator<ProfileType>;
  userId: string;
}

export const ProfileActionsButton = ({
  currentUserId,
  mutate,
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
        <FollowButton
          currentUserId={currentUserId}
          userId={userId}
          propsMutate={mutate}
        />
      )}
    </Center>
  );
};
