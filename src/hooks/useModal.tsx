import { atom, useAtom } from "jotai";
import { atomFamily } from "jotai-family";

type ModalType = "post" | "editProfile";

const modalVisibilityFamily = atomFamily(() => atom(false));

export const useModal = (modalType: ModalType) => {
	const [isVisible, setIsVisible] = useAtom(modalVisibilityFamily(modalType));

	return [isVisible, setIsVisible] as const;
};
