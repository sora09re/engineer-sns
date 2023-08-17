import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons";
import axios from "axios";
import type { KeyedMutator } from "swr";

import { PostUI } from "@/components/PostUI/PostUI";
import type { PostType } from "@/types/post";
import type { User } from "@/types/user";
import { baseURL } from "@/utils/baseUrl";

interface PostProps {
  currentUser: Pick<User, "id">;
  mutate: KeyedMutator<PostType> | KeyedMutator<PostType[]>;
  post: PostType;
}

export const Post = ({ currentUser, mutate, post }: PostProps) => {
  if (!post) {
    return null;
  }

  const index = post.likes.findIndex((like) => {
    return like.post_id === post.id;
  });

  const isLikedByCurrentUser =
    index !== -1 && post.likes[index].user_id === currentUser.id;

  const handleLikeClick = async (postId: string) => {
    try {
      if (!isLikedByCurrentUser) {
        await axios.post(`${baseURL}/api/posts/${postId}/likes`, {
          currentUserId: currentUser.id,
        });
      } else {
        await axios.delete(`${baseURL}/api/posts/${postId}/likes`, {
          params: {
            currentUserId: currentUser.id,
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
    />
  );
};
