import { atom } from "recoil";

export const userState = atom({
  default: {
    id: 1,
    bio: "Software Engineer",
    location: "Tokyo, Japan",
    name: "John Doe",
    profileImageUrl: "dummy.jpg",
    username: "@johndoe",
    website: "https://johndoe.com",
  },
  key: "userState",
});
