"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
} from '@chakra-ui/react';

// Exercise型の定義
interface Exercise {
  ExercisePId: number;
  Name: string;
  Weight: number;
  BodyPartName: string;
}

// BodyPart型の定義
interface BodyPart {
  BodyPartId: number;
  Name: string;
}

export default function ExerciseMasterPage() {

  // useStateでdataを管理
  const [data, setData] = useState<Exercise[]>([]);
  // useStateで選択したdataを管理
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  // 作成か更新かを管理するstate
  const [isNewRecord, setIsNewRecord] = useState<boolean>(true);
  // エラーメッセージを管理するstate
  const [errorMessage, setErrorMessage] = useState('');

  // 詳細モーダルを管理
  const { isOpen, onOpen, onClose } = useDisclosure();
  // エラーモーダルを管理
  const { isOpen: isDialogOpen, onOpen: openDialog, onClose: closeDialog } = useDisclosure();

  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // データを取得する関数
    const fetchData = async () => {
      try {
        const response = await fetch('https://localhost:7253/Exercise/GetExercises');

        // サーバーがエラーを返した場合は、ここでエラーチェック
        if (!response.ok) {
          // サーバーのエラーメッセージを取得
          const errorMessage = await response.text();
          // 新たなエラーを投げる
          throw new Error(errorMessage);
        }
        const result = await response.json();

        // APIレスポンスからidとnameを抽出してセット
        const formattedData = result.map((item: { exercisePId: number; name: string; weight: number; bodyPart: { name: string } }) => ({
          ExercisePId: item.exercisePId,
          Name: item.name,
          Weight: item.weight,
          BodyPartName: item.bodyPart?.name || ''
        }));

        setData(formattedData); // useStateのセッター関数を使用してdataを更新
      } catch (error) {
        console.error('データの取得に失敗しました', error);
      }
    };

    fetchData();
  }, []);

  // 行をクリックしたときに呼ばれる関数
  const handleRowClick = (exercise: Exercise) => {
    setSelectedExercise(exercise); // 選択した行のデータを設定
    onOpen(); // モーダルを開く
  };

  return (
    <>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>種目名</Th>
              <Th>重み</Th>
              <Th>部位名</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item) => (
              <Tr key={item.ExercisePId} onClick={() => handleRowClick(item)} style={{ cursor: 'pointer' }}>
                <Td>{item.Name}</Td>
                <Td>{item.Weight}</Td>
                <Td>{item.BodyPartName}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* モーダル */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>選択した種目の詳細</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedExercise && (
              <>
                <p><strong>ID:</strong> {selectedExercise.id}</p>
                <p><strong>Name:</strong> {selectedExercise.name}</p>
                <p><strong>Weight:</strong> {selectedExercise.weight}</p>
                <p><strong>BodyPartNamee:</strong> {selectedExercise.bodyPartName}</p>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              閉じる
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}