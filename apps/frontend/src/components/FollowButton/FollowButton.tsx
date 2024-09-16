import { Button } from "@mantine/core";
import { useState } from "react";
import useSWR from "swr";

import { useGetProfile } from "@/hooks/useGetProfile";
import { useGetToken } from "@/hooks/useGetToken";
import { callDeleteApi, callPostApi } from "@/utils/callApi";
import { tokenFetcher } from "@/utils/fetcher";

interface FollowButtonProps {
  currentUserId: string;
  userId: string;
}

export const FollowButton = ({ currentUserId, userId }: FollowButtonProps) => {
  const [label, setLabel] = useState("フォロー中");
  const endpoint = `/users/${userId}/follow`;
  const { mutate: getProfileMutate } = useGetProfile(userId);
  const token = useGetToken();

  const {
    data,
    error,
    mutate: fetchFollowMutate,
  } = useSWR(
    { token, url: `${endpoint}?currentUserId=${currentUserId}}` },
    tokenFetcher
  );

  if (error) {
    return <div>エラーが発生しました: {error.message}</div>;
  }

  const isFollowing = data && data.isFollowing;

  const handleFollow = async () => {
    await callPostApi(endpoint, { currentUserId }, token);
    fetchFollowMutate();
    getProfileMutate();
  };

  const handleRemoveFollow = async () => {
    await callDeleteApi(`${endpoint}?currentUserId=${currentUserId}`, token);
    fetchFollowMutate();
    getProfileMutate();
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
