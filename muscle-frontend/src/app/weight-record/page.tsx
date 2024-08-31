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

// DailyWeight型の定義
interface DailyWeight {
  id: number;
  recordedDay: Date;
  weight: number;
}

export default function WeightRecordPage() {
  // useStateでdataを管理
  const [data, setData] = useState<DailyWeight[]>([]);
  // useStateで選択したdataを管理
  const [selectedDailyWeight, setSelectedDailyWeight] = useState<DailyWeight | null>(null);

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
            recordedDay: new Date('2024-08-30'),
            weight: 81.6,
          },
          {
            id: 2,
            recordedDay: new Date('2024-08-29'),
            weight: 81.4,
          },
          {
            id: 3,
            recordedDay: new Date('2024-08-29'),
            weight: 81.2,
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
  const handleRowClick = (dailyWeight: DailyWeight) => {
    setSelectedDailyWeight(dailyWeight); // 選択した行のデータを設定
    onOpen(); // モーダルを開く
  };


  return (
    <>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>id</Th>
              <Th>recordedDay</Th>
              <Th>weight</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item) => (
              <Tr key={item.id} onClick={() => handleRowClick(item)} style={{ cursor: 'pointer' }}>
                <Td>{item.id}</Td>
                <Td>{item.recordedDay.toDateString()}</Td>
                <Td>{item.weight}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      {/* モーダル */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>選択した体重の詳細</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedDailyWeight && (
              <>
                <p><strong>ID:</strong> {selectedDailyWeight.id}</p>
                <p><strong>RecordedDay:</strong> {selectedDailyWeight.recordedDay.toDateString()}</p>
                <p><strong>Weight:</strong> {selectedDailyWeight.weight}</p>
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