import { atom } from "recoil";

export const userState = atom({
  default: {
    bio: "Software Engineer",
    location: "Tokyo, Japan",
    name: "John Doe",
    profileImage: new File([""], "dummy.jpg"),
    username: "@johndoe",
    website: "https://johndoe.com",
  },
  key: "userState",
});
