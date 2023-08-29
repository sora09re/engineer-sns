import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons";
import axios from "axios";

import { PostUI } from "@/components/PostUI/PostUI";
import { useGetCommentsForPost } from "@/hooks/useGetCommentsForPost";
import { useGetPostDetail } from "@/hooks/useGetPostDetail";
import { useGetTimelinePosts } from "@/hooks/useGetTimelinePosts";
import { useSearchPosts } from "@/hooks/useSearchPosts";
import type { PostType } from "@/types/post";
import { baseURL } from "@/utils/baseUrl";

interface PostProps {
  currentUserId: string;
  keyword?: string;
  post: PostType;
}

export const Post = ({ currentUserId, keyword, post }: PostProps) => {
  const { mutate: getTimelinePostsMutate } = useGetTimelinePosts(currentUserId);
  const { mutate: getPostDetailMutate } = useGetPostDetail(post.id);
  const { mutate: searchPostsMutate } = useSearchPosts(keyword);
  const { mutate: getCommentsForPostMutate } = useGetCommentsForPost(
    post.parent_post_id
  );

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
      getTimelinePostsMutate();
      getPostDetailMutate();
      searchPostsMutate();
      getCommentsForPostMutate();
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
