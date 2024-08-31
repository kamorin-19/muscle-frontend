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

// WorkoutRecord型の定義
interface DailyRecord {
  id: number;
  enforcementDay: Date;
  exerciseName: string;
  firstSetCount: number;
  secondSetCount: number;
  thirdSetCount: number;
}

export default function WorkoutRecordPage() {

  // useStateでdataを管理
  const [data, setData] = useState<DailyRecord[]>([]);
  // useStateで選択したdataを管理
  const [selectedDailyRecord, setSelectedDailyRecord] = useState<DailyRecord | null>(null);

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
            enforcementDay: new Date('2024-08-30'),
            exerciseName: 'バーベルスクワット',
            firstSetCount: 10,
            secondSetCount: 11,
            thirdSetCount: 12,
          },
          {
            id: 2,
            enforcementDay: new Date('2024-08-30'),
            exerciseName: 'ブルガリアンスクワット',
            firstSetCount: 10,
            secondSetCount: 11,
            thirdSetCount: 12,
          },
          {
            id: 3,
            enforcementDay: new Date('2024-08-30'),
            exerciseName: 'ダンベルプレス',
            firstSetCount: 10,
            secondSetCount: 11,
            thirdSetCount: 12,
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
  const handleRowClick = (dailyRecord: DailyRecord) => {
    setSelectedDailyRecord(dailyRecord); // 選択した行のデータを設定
    onOpen(); // モーダルを開く
  };

  return (
    <>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>id</Th>
              <Th>enforcementDay</Th>
              <Th>exerciseName</Th>
              <Th>firstSetCount</Th>
              <Th>secondSetCount</Th>
              <Th>thirdSetCount</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item) => (
              <Tr key={item.id} onClick={() => handleRowClick(item)} style={{ cursor: 'pointer' }}>
                <Td>{item.id}</Td>
                <Td>{item.enforcementDay.toDateString()}</Td>
                <Td>{item.exerciseName}</Td>
                <Td>{item.firstSetCount}</Td>
                <Td>{item.secondSetCount}</Td>
                <Td>{item.thirdSetCount}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      {/* モーダル */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>選択した日々記録の詳細</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedDailyRecord && (
              <>
                <p><strong>ID:</strong> {selectedDailyRecord.id}</p>
                <p><strong>EnforcementDay:</strong> {selectedDailyRecord.enforcementDay.toDateString()}</p>
                <p><strong>ExerciseName:</strong> {selectedDailyRecord.exerciseName}</p>
                <p><strong>FirstSetCount:</strong> {selectedDailyRecord.id}</p>
                <p><strong>SecondSetCount:</strong> {selectedDailyRecord.secondSetCount}</p>
                <p><strong>ThirdSetCount:</strong> {selectedDailyRecord.thirdSetCount}</p>
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