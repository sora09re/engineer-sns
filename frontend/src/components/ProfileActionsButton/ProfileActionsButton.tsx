import { Button, Center } from "@mantine/core";
import axios from "axios";
import type { KeyedMutator } from "swr";
import useSWR from "swr";

import { useModal } from "@/hooks/useModal";
import type { ProfileType } from "@/types/profile";
import { baseURL } from "@/utils/baseUrl";
import { fetcher } from "@/utils/fetcher";

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
  const endpoint = `${baseURL}/api/users/${userId}/follow`;
  const isCurrentUser = currentUserId === userId;

  const {
    data,
    error,
    mutate: fetchFollowMutate,
  } = useSWR(`${endpoint}?currentUserId=${currentUserId}`, fetcher);

  if (error) {
    return <div>エラーが発生しました: {error.message}</div>;
  }

  const isFollowing = data && data.isFollowing;

  const handleFollow = async () => {
    await axios.post(`${endpoint}?currentUserId=${currentUserId}`);
    fetchFollowMutate();
    mutate();
  };

  const handleRemoveFollow = async () => {
    await axios.delete(`${endpoint}`, {
      params: {
        currentUserId,
      },
    });
    fetchFollowMutate();
    mutate();
  };

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
      ) : isFollowing ? (
        <Button variant="outline" color="dark" onClick={handleRemoveFollow}>
          フォロー中
        </Button>
      ) : (
        <Button onClick={handleFollow}>フォロー</Button>
      )}
    </Center>
  );
};
