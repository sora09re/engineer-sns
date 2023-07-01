import { atomFamily } from "recoil";

export type ModalType = "comment" | "post" | "editProfile" | "login" | "signup";
export const ModalVisibilityState = atomFamily({
  default: false,
  key: "ModalVisibilityState",
});
