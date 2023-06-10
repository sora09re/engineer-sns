import { atomFamily } from "recoil";

export type ModalType = "comment" | "post" | "editProfile";
export const ModalVisibilityState = atomFamily({
  default: false,
  key: "ModalVisibilityState",
});
