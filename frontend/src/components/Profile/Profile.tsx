import { Box, Loader } from "@mantine/core";

import { ProfileActionsButton } from "@/components/ProfileActionsButton/ProfileActionsButton";
import { ProfileHeader } from "@/components/ProfileHeader/ProfileHeader";
import { ProfileStats } from "@/components/ProfileStats/ProfileStats";
import type { ProfileType } from "@/types/profile";

interface ProfileProps {
  currentUserId: string;
  user: ProfileType | undefined;
}

export const Profile = ({ currentUserId, user }: ProfileProps) => {
  if (!user) {
    return <Loader />;
  }

  return (
    <Box
      p="xl"
      w="100%"
      sx={{
        borderBottom: "1px solid #E9ECEF",
      }}
    >
      <ProfileHeader user={user} />
      <ProfileStats user={user} />
      <ProfileActionsButton currentUserId={currentUserId} userId={user.id} />
    </Box>
  );
};
