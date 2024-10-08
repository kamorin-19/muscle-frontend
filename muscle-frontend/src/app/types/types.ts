import { RefObject } from 'react';

// BodyPart型の定義
export interface BodyPart {
  BodyPartId: number;
  Name: string;
}

// Exercise型の定義
export interface Exercise {
    ExercisePId: number;
    Name: string;
    Weight: number | string;
    BodyPartName: string;
    BodyPart: BodyPart;
}

// エラーモーダルの型定義
export interface ErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    errorMessage: string;
    cancelRef: RefObject<HTMLButtonElement>;
}