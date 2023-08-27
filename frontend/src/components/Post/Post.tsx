import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons";
import axios from "axios";

import { PostUI } from "@/components/PostUI/PostUI";
import { useGetTimelinePosts } from "@/hooks/useGetTimelinePosts";
import type { PostType } from "@/types/post";
import { baseURL } from "@/utils/baseUrl";

interface PostProps {
  currentUserId: string;
  post: PostType;
}

export const Post = ({ currentUserId, post }: PostProps) => {
  const { mutate } = useGetTimelinePosts(currentUserId);

  if (!post) {
    return null;
  }

  const index = post.likes.findIndex((like) => {
    return like.post_id === post.id;
  });

  const isLikedByCurrentUser =
    index !== -1 && post.likes[index].user_id === currentUserId;

  const handleLikeClick = async (postId: string) => {
    try {
      if (!isLikedByCurrentUser) {
        await axios.post(`${baseURL}/api/posts/${postId}/likes`, {
          currentUserId: currentUserId,
        });
      } else {
        await axios.delete(`${baseURL}/api/posts/${postId}/likes`, {
          params: {
            currentUserId: currentUserId,
          },
        });
      }
      mutate();
    } catch (error) {
      notifications.show({
        id: "click-likes",
        autoClose: 2000,
        color: "red",
        icon: <IconX size="1rem" />,
        message: "いいねに失敗しました。",
        title: "エラー",
      });
    }
  };

  return (
    <PostUI
      post={post}
      isLikedByCurrentUser={isLikedByCurrentUser}
      handleLikeClick={handleLikeClick}
      currentUserId={currentUserId}
    />
  );
};
