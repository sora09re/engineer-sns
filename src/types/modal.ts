import { atomFamily } from "recoil";

export type ModalType = "post" | "editProfile";
export const ModalVisibilityState = atomFamily({
	default: false,
	key: "ModalVisibilityState",
});
