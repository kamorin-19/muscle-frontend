import { RefObject } from 'react';

// BodyPart型の定義
export interface BodyPart {
  BodyPartId: number;
  Name: string;
}

// エラーモーダルの型定義
export interface ErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    errorMessage: string;
    cancelRef: RefObject<HTMLButtonElement>;
}