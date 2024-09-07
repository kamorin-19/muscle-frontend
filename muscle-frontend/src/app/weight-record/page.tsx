"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
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
  Input,
  Select
} from '@chakra-ui/react';

// DailyWeight型の定義
interface DailyWeight {
  DailyWeightId: number;
  RecordedDay: Date | null;
  Weight: number;
}

export default function WeightRecordPage() {
  // useStateでdataを管理
  const [data, setData] = useState<DailyWeight[]>([]);
  // useStateで選択したdataを管理
  const [selectedDailyWeight, setSelectedDailyWeight] = useState<DailyWeight | null>(null);

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
        //const response = await fetch('https://localhost:7253/BodyPart/GetBodyParts');
        //const result = await response.json();

        // APIレスポンスからidとnameを抽出してセット
        // const formattedData = result.map((item: { bodyPartId: number; name: string }) => ({
        //   id: item.bodyPartId,
        //   name: item.name,
        // }));

        const formattedData: DailyWeight[] = [
          {
            DailyWeightId: 1,
            RecordedDay: new Date('2024-08-30'),
            Weight: 81.6,
          },
          {
            DailyWeightId: 2,
            RecordedDay: new Date('2024-08-29'),
            Weight: 81.4,
          },
          {
            DailyWeightId: 3,
            RecordedDay: new Date('2024-08-29'),
            Weight: 81.2,
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
  const handleRowClick = (dailyWeight: DailyWeight | null = null) => {
    // 選択した行のデータを設定
    setSelectedDailyWeight(dailyWeight);
    // 作成か更新かを設定
    setIsNewRecord(!dailyWeight);
    // モーダルを開く
    onOpen();
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value); // YYYY-MM-DD形式の文字列を取得
    if (selectedDailyWeight) {
      setSelectedDailyWeight({
        ...selectedDailyWeight,
        RecordedDay: newDate,
      });
    } else {
      setSelectedDailyWeight({
        DailyWeightId: 0,
        Weight: 0,
        RecordedDay: newDate,
      });
    }
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 入力された数値を取得
    const newWeight = parseFloat(e.target.value);
    if (selectedDailyWeight) {
      setSelectedDailyWeight({
        ...selectedDailyWeight,
        Weight: newWeight,
      });
    } else {
      setSelectedDailyWeight({
        DailyWeightId: 0,
        Weight: newWeight,
        RecordedDay: null,
      });
    }
  };

  // 情報作成のリクエストを投げる
  const createDailyWeight = useCallback(async () => {
    try {
      // DateオブジェクトをDateOnly型（YYYY-MM-DD形式）に変換
      const payload = {
        DailyWeightId: 0,
        Weight: selectedDailyWeight?.Weight,
        RecordedDay: selectedDailyWeight?.RecordedDay
          ? new Date(selectedDailyWeight.RecordedDay).toISOString().split('T')[0] // YYYY-MM-DD形式に変換
          : null,
      };
      const response = await fetch('https://localhost:7253/DailyWeight/AddDailyWeight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // サーバーがエラーを返した場合は、ここでエラーチェック
      if (!response.ok) {
        // サーバーのエラーメッセージを取得
        const errorMessage = await response.text();
        // 新たなエラーを投げる
        throw new Error(errorMessage);
      } else {
        /*const fetchData = async () => {
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
            const formattedData = result.map((item: { exercisePId: number; name: string; weight: number; bodyPart: BodyPart }) => ({
              ExercisePId: item.exercisePId,
              Name: item.name,
              Weight: item.weight,
              BodyPartName: item.bodyPart?.name || '',
              BodyPart: item.bodyPart
            }));

            setData(formattedData); // useStateのセッター関数を使用してdataを更新
            onClose();
          } catch (error: any) {
            setErrorMessage(error.message);
            openDialog();
          }
        };

        fetchData();*/
      }
    } catch (error: any) {
      setErrorMessage(error.message);
      openDialog();
    }
  }, [selectedDailyWeight]);



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
              <Tr key={item.DailyWeightId} onClick={() => handleRowClick(item)} style={{ cursor: 'pointer' }}>
                <Td>{item.DailyWeightId}</Td>
                <Td>{item.RecordedDay ? item.RecordedDay.toDateString() : 'No Date'}</Td>
                <Td>{item.Weight}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Button mt={4} colorScheme="teal" onClick={() => handleRowClick()} style={{ cursor: 'pointer' }}>
          追加
        </Button>
      </TableContainer>
      {/* モーダル */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>選択した体重の詳細</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              type="date"
              placeholder="date"
              value={selectedDailyWeight?.RecordedDay ? new Date(selectedDailyWeight.RecordedDay).toISOString().split('T')[0] : ''}
              onChange={handleDateChange}
            />
            <br />
            <Input
              type="number"
              placeholder="Weight"
              value={selectedDailyWeight ? selectedDailyWeight.Weight : 0}
              onChange={handleWeightChange}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => { isNewRecord ? createDailyWeight() : console.log(2) }}>
              {isNewRecord ? '作成' : '更新'}
            </Button>
            {isNewRecord ? null :
              <Button colorScheme="blue" mr={3} onClick={() => { console.log(3) }}>
                削除
              </Button>
            }
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              閉じる
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}