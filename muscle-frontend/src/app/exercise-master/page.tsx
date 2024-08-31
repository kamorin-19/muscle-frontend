"use client";

import { useEffect, useState } from 'react';
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
  id: number;
  name: string;
  weight: number;
  bodyPartName: string;
}

export default function ExerciseMasterPage() {

  // useStateでdataを管理
  const [data, setData] = useState<Exercise[]>([]);
  // useStateで選択したdataを管理
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    // データを取得する関数
    const fetchData = async () => {
      try {
        //const response = await fetch('https://localhost:7253/BodyPart/GetBodyParts');
        //const result = await response.json();

        // APIレスポンスからidとnameを抽出してセット
        // const formattedData = result.map((item: { bodyPartId: number; name: string }) => ({
        //   id: item.bodyPartId,
        //   name: item.name,
        // }));

        const formattedData = [
          {
            id: 1,
            name: 'バーベルスクワット',
            weight: 0.2,
            bodyPartName: '脚'
          },
          {
            id: 2,
            name: 'ブルガリアンスクワット',
            weight: 0.4,
            bodyPartName: '脚'
          },
          {
            id: 3,
            name: 'ダンベルプレス',
            weight: 0.4,
            bodyPartName: '胸'
          },
        ];

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
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Weight</Th>
              <Th>BodyPartNamee</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item) => (
              <Tr key={item.id}　onClick={() => handleRowClick(item)} style={{ cursor: 'pointer' }}>
                <Td>{item.id}</Td>
                <Td>{item.name}</Td>
                <Td>{item.weight}</Td>
                <Td>{item.bodyPartName}</Td>
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