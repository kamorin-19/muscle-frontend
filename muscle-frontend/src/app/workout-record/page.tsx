"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
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
  Input,
  Select
} from '@chakra-ui/react';
import { it } from 'node:test';

// WorkoutRecord型の定義
interface DailyRecord {
  DailyRecordId: number;
  EnforcementDay: Date | null;
  ExercisePId: number;
  Exercise: Exercise | null;
  FirstSetCount: number;
  SecondSetCount: number;
  ThirdSetCount: number;
  FourthSetCount: number;
  FifthSetCount: number;
}

// Exercise型の定義
interface Exercise {
  ExercisePId: number;
  Name: string;
  Weight: number;
  BodyPartName: string;
  BodyPart: BodyPart;
}

// BodyPart型の定義
interface BodyPart {
  BodyPartId: number;
  Name: string;
}

export default function WorkoutRecordPage() {

  // useStateでdataを管理
  const [data, setData] = useState<DailyRecord[]>([]);
  // useStateでexercisesを管理
  const [exercises, setExercises] = useState<Exercise[]>([]);
  // useStateで選択したdataを管理
  const [selectedDailyRecord, setSelectedDailyRecord] = useState<DailyRecord | null>(null);
  // useStateで選択したdataを管理
  const [selectedExercises, setSelectedExercises] = useState<Exercise | null>(null);
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
        const response = await fetch('https://localhost:7253/DailyRecord/GetDailyRecord');

        // サーバーがエラーを返した場合は、ここでエラーチェック
        if (!response.ok) {
          // サーバーのエラーメッセージを取得
          const errorMessage = await response.text();
          // 新たなエラーを投げる
          throw new Error(errorMessage);
        }
        const result = await response.json();

        // APIレスポンスからidとnameを抽出してセット
        const formattedData = result.map((item: {
          DailyRecordId: number;
          EnforcementDay: Date;
          ExercisePId: number;
          Exercise: Exercise;
          FirstSetCount: number;
          SecondSetCount: number;
          ThirdSetCount: number;
          FourthSetCount: number;
          FifthSetCount: number;
        }) => ({
          DailyRecordId: item.DailyRecordId,
          EnforcementDay: item.EnforcementDay,
          ExercisePId: item.ExercisePId,
          Exercise: item.Exercise,
          FirstSetCount: item.FirstSetCount,
          SecondSetCount: item.SecondSetCount,
          ThirdSetCount: item.ThirdSetCount,
          FourthSetCount: item.FourthSetCount,
          FifthSetCount: item.FifthSetCount,
        }));

        setData(formattedData);
      } catch (error) {
        console.error('データの取得に失敗しました', error);
      }
    };

    fetchData();
  }, []);

  // 行をクリックしたときに呼ばれる関数
  const handleRowClick = async (dailyRecord: DailyRecord | null = null) => {
    // 種目マスタを取得
    await fetchExercises();
    console.log("？");
    console.log(dailyRecord);
    console.log("？");
    // 選択した行のデータを設定
    setSelectedDailyRecord(dailyRecord);
    // 作成か更新かを設定
    setIsNewRecord(!dailyRecord);
    if (dailyRecord) {
      const exercise = exercises.find(exercise => exercise.ExercisePId === dailyRecord.ExercisePId);
      setSelectedExercises(exercise!);
    }
    onOpen(); // モーダルを開く
  };

  // 種目マスタを取得する関数
  const fetchExercises = async () => {
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
      const formattedData = result.map((item: { ExercisePId: number; Name: string; weight: number; BodyPart: BodyPart }) => ({
        ExercisePId: item.ExercisePId,
        Name: item.Name,
        Weight: item.weight,
        BodyPartName: item.BodyPart?.Name || '',
        BodyPart: item.BodyPart
      }));

      setExercises(formattedData);
    } catch (error) {
      console.error('データの取得に失敗しました', error);
    }
  }

  // 種目を取得する関数
  const handleExerciseChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      // 選択された種目のidを取得
      const selectedExerciseId = Number(e.target.value);
      // 選択された種目のnameを取得
      const selectedExercise1 = exercises.find(exercise => exercise.ExercisePId === selectedExerciseId);
      setSelectedExercises(selectedExercise1!);
      if (selectedDailyRecord) {
        // 既にデータが設定されているとき
        setSelectedDailyRecord({
          ...selectedDailyRecord,
          Exercise: selectedExercises!,
        });
      } else {
        // まだデータが設定されていないとき
        setSelectedDailyRecord({
          DailyRecordId: 1,
          Exercise: selectedExercises!,
          ExercisePId: 1,
          EnforcementDay: null,
          FirstSetCount: 1,
          SecondSetCount: 2,
          ThirdSetCount: 3,
          FourthSetCount: 4,
          FifthSetCount: 5,
        });
      }
    } catch (error) {
      console.error('BodyPartデータの取得に失敗しました', error);
    }
  };

  // 日付を変更したときに呼ばれる関数
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value); // YYYY-MM-DD形式の文字列を取得
    if (selectedDailyRecord) {
      // 既にデータが設定されているとき
      setSelectedDailyRecord({
        ...selectedDailyRecord,
        EnforcementDay: newDate,
      });
    } else {
      // 既にデータが設定されているとき
      setSelectedDailyRecord({
        DailyRecordId: 1,
        Exercise: null,
        ExercisePId: 1,
        EnforcementDay: null,
        FirstSetCount: 1,
        SecondSetCount: 2,
        ThirdSetCount: 3,
        FourthSetCount: 4,
        FifthSetCount: 5,
      });
    }
  };

  // 1回目のレップスを変更したときに呼ばれる関数
  const handleFirstSetCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedDailyRecord) {
      // 既にデータが設定されているとき
      setSelectedDailyRecord({
        ...selectedDailyRecord,
        FirstSetCount: Number(e.target.value),
      });
    } else {
      // 既にデータが設定されているとき
      setSelectedDailyRecord({
        DailyRecordId: 1,
        Exercise: null,
        ExercisePId: 1,
        EnforcementDay: null,
        FirstSetCount: Number(e.target.value),
        SecondSetCount: 2,
        ThirdSetCount: 3,
        FourthSetCount: 4,
        FifthSetCount: 5,
      });
    }
  };

  // 2回目のレップスを変更したときに呼ばれる関数
  const handleSecondSetCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedDailyRecord) {
      // 既にデータが設定されているとき
      setSelectedDailyRecord({
        ...selectedDailyRecord,
        SecondSetCount: Number(e.target.value),
      });
    } else {
      // 既にデータが設定されているとき
      setSelectedDailyRecord({
        DailyRecordId: 1,
        Exercise: null,
        ExercisePId: 0,
        EnforcementDay: null,
        FirstSetCount: 0,
        SecondSetCount: Number(e.target.value),
        ThirdSetCount: 0,
        FourthSetCount: 0,
        FifthSetCount: 0,
      });
    }
  };

  // 3回目のレップスを変更したときに呼ばれる関数
  const handleThirdSetCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedDailyRecord) {
      // 既にデータが設定されているとき
      setSelectedDailyRecord({
        ...selectedDailyRecord,
        ThirdSetCount: Number(e.target.value),
      });
    } else {
      // 既にデータが設定されているとき
      setSelectedDailyRecord({
        DailyRecordId: 0,
        Exercise: null,
        ExercisePId: 0,
        EnforcementDay: null,
        FirstSetCount: 0,
        SecondSetCount: 0,
        ThirdSetCount: Number(e.target.value),
        FourthSetCount: 0,
        FifthSetCount: 0,
      });
    }
  };

  // 情報作成のリクエストを投げる
  const createDailyRecord = useCallback(async () => {
    try {
      // DateオブジェクトをDateOnly型（YYYY-MM-DD形式）に変換
      const payload = {
        ...selectedDailyRecord,
        EnforcementDay: selectedDailyRecord?.EnforcementDay
          ? new Date(selectedDailyRecord.EnforcementDay).toISOString().split('T')[0]
          : null,
      };
      const response = await fetch('https://localhost:7253/DailyRecord/AddDailyRecord', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // サーバーがエラーを返した場合は、ここでエラーチェック
      /*if (!response.ok) {
        // サーバーのエラーメッセージを取得
        const errorMessage = await response.text();
        // 新たなエラーを投げる
        throw new Error(errorMessage);
      } else {
        // データを取得する関数
        const fetchData = async () => {
          try {
            const response = await fetch('https://localhost:7253/DailyWeight/GetDailyWeight');

            // サーバーがエラーを返した場合は、ここでエラーチェック
            if (!response.ok) {
              // サーバーのエラーメッセージを取得
              const errorMessage = await response.text();
              // 新たなエラーを投げる
              throw new Error(errorMessage);
            }
            const result = await response.json();

            // APIレスポンスからidとnameを抽出してセット
            const formattedData = result.map((item: { dailyWeightId: number; recordedDay: Date; weight: number; }) => ({
              DailyWeightId: item.dailyWeightId,
              RecordedDay: item.recordedDay,
              Weight: item.weight,
            }));

            setData(formattedData); // useStateのセッター関数を使用してdataを更新
            onClose();
          } catch (error: any) {
            setErrorMessage(error.message);
            openDialog();
          }
        };

        fetchData();
      }*/
    } catch (error: any) {
      setErrorMessage(error.message);
      openDialog();
    }
  }, [selectedDailyRecord]);

  // 情報作成のリクエストを投げる
  const updateDailyRecord = useCallback(async () => {
    try {
      // DateオブジェクトをDateOnly型（YYYY-MM-DD形式）に変換
      const payload = {
        ...selectedDailyRecord,
        EnforcementDay: selectedDailyRecord?.EnforcementDay
          ? new Date(selectedDailyRecord.EnforcementDay).toISOString().split('T')[0]
          : null,
      };
      console.log(JSON.stringify(payload));
      const response = await fetch('https://localhost:7253/DailyRecord/UpdateDailyRecord', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // サーバーがエラーを返した場合は、ここでエラーチェック
      /*if (!response.ok) {
        // サーバーのエラーメッセージを取得
        const errorMessage = await response.text();
        // 新たなエラーを投げる
        throw new Error(errorMessage);
      } else {
        // データを取得する関数
        const fetchData = async () => {
          try {
            const response = await fetch('https://localhost:7253/DailyWeight/GetDailyWeight');
 
            // サーバーがエラーを返した場合は、ここでエラーチェック
            if (!response.ok) {
              // サーバーのエラーメッセージを取得
              const errorMessage = await response.text();
              // 新たなエラーを投げる
              throw new Error(errorMessage);
            }
            const result = await response.json();
 
            // APIレスポンスからidとnameを抽出してセット
            const formattedData = result.map((item: { dailyWeightId: number; recordedDay: Date; weight: number; }) => ({
              DailyWeightId: item.dailyWeightId,
              RecordedDay: item.recordedDay,
              Weight: item.weight,
            }));
 
            setData(formattedData); // useStateのセッター関数を使用してdataを更新
            onClose();
          } catch (error: any) {
            setErrorMessage(error.message);
            openDialog();
          }
        };
 
        fetchData();
      }*/
    } catch (error: any) {
      setErrorMessage(error.message);
      openDialog();
    }
  }, [selectedDailyRecord]);

  return (
    <>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>EnforcementDay</Th>
              <Th>ExercisePId</Th>
              <Th>FirstSetCount</Th>
              <Th>SecondSetCount</Th>
              <Th>ThirdSetCount</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item) => (
              <Tr key={item.DailyRecordId} onClick={() => handleRowClick(item)} style={{ cursor: 'pointer' }}>
                <Td>{item.EnforcementDay ? new Date(item.EnforcementDay).toISOString().split('T')[0] : ''}</Td>
                <Td>{item.Exercise?.Name}</Td>
                <Td>{item.FirstSetCount}</Td>
                <Td>{item.SecondSetCount}</Td>
                <Td>{item.ThirdSetCount}</Td>
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
          <ModalHeader>選択した日々記録の詳細</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              type="date"
              placeholder="date"
              value={selectedDailyRecord?.EnforcementDay ? new Date(selectedDailyRecord.EnforcementDay).toISOString().split('T')[0] : ''}
              onChange={handleDateChange}
            />
            <br />
            {/* コンボボックス */}
            <Select
              placeholder="Select "
              value={selectedDailyRecord?.Exercise?.Name ? selectedDailyRecord?.Exercise?.Name : ''}
              onChange={handleExerciseChange}
            >
              {exercises.length > 0 ? (
                exercises.map((exercise) => (
                  <option key={exercise.ExercisePId} value={exercise.ExercisePId}>
                    {exercise.Name}
                  </option>
                ))
              ) : (
                <option disabled>Loading...</option>
              )}
            </Select>
            <br />
            <Input
              type="number"
              placeholder="FirstSetCount"
              value={selectedDailyRecord ? selectedDailyRecord.FirstSetCount : 0}
              onChange={handleFirstSetCountChange}
            />
            <br />
            <Input
              type="number"
              placeholder="SecondSetCount"
              value={selectedDailyRecord ? selectedDailyRecord.SecondSetCount : 0}
              onChange={handleSecondSetCountChange}
            />
            <br />
            <Input
              type="number"
              placeholder="ThirdSetCount"
              value={selectedDailyRecord ? selectedDailyRecord.ThirdSetCount : 0}
              onChange={handleThirdSetCountChange}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => { isNewRecord ? createDailyRecord() : updateDailyRecord() }}>
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