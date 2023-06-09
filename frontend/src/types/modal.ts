import { atomFamily } from "recoil";

export type ModalType = "comment" | "post" | "confirm";
export const ModalVisibilityState = atomFamily({
  default: false,
  key: "ModalVisibilityState",
});
