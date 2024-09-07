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
  Input,
  Select
} from '@chakra-ui/react';

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
  bodyPartId: number;
  name: string;
}

export default function ExerciseMasterPage() {

  // useStateでdataを管理
  const [data, setData] = useState<Exercise[]>([]);
  // useStateでbodyPartsを管理
  const [bodyParts, setBodyParts] = useState<BodyPart[]>([]);
  // useStateで選択したdataを管理
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  // useStateで選択したdataを管理
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart | null>(null);
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
        const formattedData = result.map((item: { exercisePId: number; name: string; weight: number; bodyPart: BodyPart }) => ({
          ExercisePId: item.exercisePId,
          Name: item.name,
          Weight: item.weight,
          BodyPartName: item.bodyPart?.name || '',
          BodyPart: item.bodyPart
        }));

        setData(formattedData); // useStateのセッター関数を使用してdataを更新
      } catch (error) {
        console.error('データの取得に失敗しました', error);
      }
    };

    fetchData();
  }, []);

  // 行をクリックしたときに呼ばれる関数
  const handleRowClick = async (exercise: Exercise | null = null) => {
    // BodyPartデータを取得
    await fetchBodyParts();
    // 選択した行のデータを設定
    setSelectedExercise(exercise);
    // 作成か更新かを設定
    setIsNewRecord(!exercise);
    if (exercise) {
      const bodyPart = {
        bodyPartId: exercise?.BodyPart?.bodyPartId,
        name: exercise?.BodyPartName || ''
      };
      setSelectedBodyPart(bodyPart)
    }
    onOpen(); // モーダルを開く
  };

  // BodyPartデータを取得する関数
  const fetchBodyParts = async () => {
    try {
      const response = await fetch('https://localhost:7253/BodyPart/GetBodyParts');

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
      const result = await response.json();

      // APIレスポンスからidとnameを抽出してセット
      const formattedData = result.map((item: { bodyPartId: number; name: string }) => ({
        bodyPartId: item.bodyPartId,
        name: item.name,
      }));
      setBodyParts(formattedData);
    } catch (error) {
      console.error('BodyPartデータの取得に失敗しました', error);
    }
  };

  // 種目名の変更を検知するイベント
  const handleExerciseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedExercise) {
      setSelectedExercise({
        ...selectedExercise,
        Name: e.target.value,
      });
    } else {
      setSelectedExercise({
        ExercisePId: 0,
        Name: e.target.value,
        Weight: 0,
        BodyPartName: '',
        BodyPart: { bodyPartId: 0, name: '' }
      });
    }
  };

  // 重みの変更を検知するイベント
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedExercise) {
      setSelectedExercise({
        ...selectedExercise,
        Weight: Number(e.target.value),
      });
    } else {
      setSelectedExercise({
        ExercisePId: 0,
        Name: '',
        Weight: Number(e.target.value),
        BodyPartName: '',
        BodyPart: { bodyPartId: 0, name: '' }
      });
    }
  };

  // BodyPartの選択を処理する関数
  const handleBodyPartChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // 選択されたBodyPartのidを取得
    const selectedBodyPartId = Number(e.target.value);
    // 選択されたBodyPartのnameを取得
    const selectedBodyPartName = bodyParts.find(part => part.bodyPartId === selectedBodyPartId)?.name || '';
    if (selectedExercise) {
      console.log(1)
      console.log(e.target.value)
      setSelectedExercise({
        ...selectedExercise,
        BodyPart: { bodyPartId: selectedBodyPartId, name: selectedBodyPartName }
      });
    } else {
      setSelectedExercise({
        ExercisePId: 0,
        Name: '',
        Weight: 0,
        BodyPartName: selectedBodyPartName,
        BodyPart: { bodyPartId: selectedBodyPartId, name: selectedBodyPartName }
      });
    }
  };

  // マスタ作成のリクエストを投げる
  const createExcercise = useCallback(async () => {
    try {
      const response = await fetch('https://localhost:7253/BodyPart/Exercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyParts),
      });

      // サーバーがエラーを返した場合は、ここでエラーチェック
      if (!response.ok) {
        // サーバーのエラーメッセージを取得
        const errorMessage = await response.text();
        // 新たなエラーを投げる
        throw new Error(errorMessage);
      } else {
        const fetchData = async () => {
          try {
            const response = await fetch('https://localhost:7253/BodyPart/GetBodyParts');

            // サーバーがエラーを返した場合は、ここでエラーチェック
            if (!response.ok) {
              // サーバーのエラーメッセージを取得
              const errorMessage = await response.text();
              // 新たなエラーを投げる
              throw new Error(errorMessage);
            }
            const result = await response.json();

            // APIレスポンスからidとnameを抽出してセット
            const formattedData = result.map((item: { bodyPartId: number; name: string }) => ({
              bodyPartId: item.bodyPartId,
              name: item.name,
            }));

            onClose();
          } catch (error: any) {
            setErrorMessage(error.message);
            openDialog();
          }
        };

        fetchData();
      }
    } catch (error: any) {
      setErrorMessage(error.message);
      openDialog();
    }
  }, [bodyParts]);

  // マスタ更新のリクエストを投げる
  const updateExercise = useCallback(async () => {
    try {
      const response = await fetch('https://localhost:7253/Exercise/UpdateExercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedExercise),
      });

      // サーバーがエラーを返した場合は、ここでエラーチェック
      if (!response.ok) {
        // サーバーのエラーメッセージを取得
        const errorMessage = await response.text();
        // 新たなエラーを投げる
        throw new Error(errorMessage);
      } else {
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

        fetchData();
      }
    } catch (error: any) {
      setErrorMessage(error.message);
      openDialog();
    }
  }, [selectedExercise]);

  // マスタ削除のリクエストを投げる
  const deleteExercise = useCallback(async () => {
    try {
      const response = await fetch('https://localhost:7253/Exercise/DeleteExercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedExercise),
      });

      // サーバーがエラーを返した場合は、ここでエラーチェック
      if (!response.ok) {
        // サーバーのエラーメッセージを取得
        const errorMessage = await response.text();
        // 新たなエラーを投げる
        throw new Error(errorMessage);
      } else {
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
            onClose();
          } catch (error: any) {
            setErrorMessage(error.message);
            openDialog();
          }
        };

        fetchData();
      }
    } catch (error: any) {
      setErrorMessage(error.message);
      openDialog();
    }
  }, [selectedExercise]);

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
        <Button mt={4} colorScheme="teal" onClick={() => handleRowClick()} style={{ cursor: 'pointer' }}>
          追加
        </Button>
      </TableContainer>

      {/* モーダル */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>選択した種目の詳細</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* selectedBodyPartが設定されている場合はそのnameを表示し、そうでなければnullを表示する */}
            <Input
              placeholder="Exercise Name"
              value={selectedExercise ? selectedExercise.Name : ''}
              onChange={handleExerciseChange}
            />
            <br />
            <Input
              placeholder="Weight"
              value={selectedExercise ? selectedExercise.Weight : 0}
              onChange={handleWeightChange}
            />
            {/* コンボボックス */}
            <Select
              placeholder="Select Body Part"
              value={selectedExercise?.BodyPartName || ''}
              onChange={handleBodyPartChange}
            >
              {bodyParts.length > 0 ? (
                bodyParts.map((part) => (
                  <option key={part.bodyPartId} value={part.bodyPartId}>
                    {part.name}
                  </option>
                ))
              ) : (
                <option disabled>Loading...</option>
              )}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => { isNewRecord ? console.log(1) : updateExercise() }}>
              {isNewRecord ? '作成' : '更新'}
            </Button>
            {isNewRecord ? null :
              <Button colorScheme="blue" mr={3} onClick={() => { deleteExercise() }}>
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