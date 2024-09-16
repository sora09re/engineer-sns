import type { SetterOrUpdater } from "recoil";
import { useRecoilState } from "recoil";

import type { ModalType } from "@/types/modal";
import { ModalVisibilityState } from "@/types/modal";

type Response = [boolean, SetterOrUpdater<boolean>];

export const useModal = (modalType: ModalType): Response => {
  const [isVisible, setIsVisible] = useRecoilState(
    ModalVisibilityState(modalType)
  );

  return [isVisible, setIsVisible];
};
