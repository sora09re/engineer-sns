import { Button } from "@mantine/core";
import axios from "axios";
import { useState } from "react";
import type { KeyedMutator } from "swr";
import useSWR from "swr";

import type { ProfileType } from "@/types/profile";
import { baseURL } from "@/utils/baseUrl";
import { fetcher } from "@/utils/fetcher";

interface FollowButtonProps {
  currentUserId: string;
  propsMutate?: KeyedMutator<ProfileType>;
  userId: string;
}

export const FollowButton = ({
  currentUserId,
  propsMutate,
  userId,
}: FollowButtonProps) => {
  const [label, setLabel] = useState("フォロー中");
  const endpoint = `${baseURL}/api/users/${userId}/follow`;

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
    if (propsMutate) {
      propsMutate();
    }
  };

  const handleRemoveFollow = async () => {
    await axios.delete(`${endpoint}`, {
      params: {
        currentUserId,
      },
    });
    fetchFollowMutate();
    if (propsMutate) {
      propsMutate();
    }
  };

  return (
    <>
      {isFollowing ? (
        <Button
          onMouseEnter={() => {
            return setLabel("フォロー解除");
          }}
          onMouseLeave={() => {
            return setLabel("フォロー中");
          }}
          variant="outline"
          color="dark"
          styles={(theme) => {
            return {
              root: {
                "&:not([data-disabled])": theme.fn.hover({
                  backgroundColor: "white",
                  borderColor: "red",
                  color: "red",
                }),
              },
            };
          }}
          onClick={(event) => {
            event.stopPropagation();
            return handleRemoveFollow();
          }}
        >
          {label}
        </Button>
      ) : (
        <Button
          onClick={(event) => {
            event.stopPropagation();
            return handleFollow();
          }}
        >
          フォロー
        </Button>
      )}
    </>
  );
};
