"use client";

import { useEffect, useState, useRef } from 'react';
import {
  Button,
  Flex,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useDisclosure,
} from '@chakra-ui/react';

import { BodyPart, Exercise } from '@/app/types/types';
import ErrorModal from '@/app/components/ErrorModal';

export default function ExerciseMasterPage() {

  // state定義
  // 種目一覧を管理
  const [exerciseList, setExerciseList] = useState<Exercise[]>([]);
  // 部位一覧を管理
  const [bodyParts, setBodyParts] = useState<BodyPart[]>([]);
  // 選択した種目を管理
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  // 選択した部位を管理
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart | null>(null);
  // 作成か更新かを管理
  const [isNewRecord, setIsNewRecord] = useState<boolean>(true);
  // エラーメッセージを管理
  const [errorMessage, setErrorMessage] = useState('');

  // モーダル管理
  // 詳細モーダルを管理
  const { isOpen, onOpen, onClose } = useDisclosure();
  // エラーモーダルを管理
  const { isOpen: isDialogOpen, onOpen: openDialog, onClose: closeDialog } = useDisclosure();

  const cancelRef = useRef<HTMLButtonElement>(null);

  // 関数定義
  // データ処理関連
  // 種目マスタ取得関数
  const fetchExercises = async () => {
    try {

      const apiUrl = new URL(process.env.NEXT_PUBLIC_FETCH_EXERCISES_URL!);
      const response = await fetch(apiUrl);

      if (!response.ok) {
        // レスポンスがエラーの場合
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const result = await response.json();

      // APIレスポンスからidとnameを抽出してセット
      const exercises = result.map((item: { ExercisePId: number; Name: string; Weight: number; BodyPart: BodyPart }) => ({
        ExercisePId: item.ExercisePId,
        Name: item.Name,
        Weight: item.Weight,
        BodyPartName: item.BodyPart?.Name || '',
        BodyPart: item.BodyPart
      }));

      setExerciseList(exercises);

    } catch (error: any) {
      setErrorMessage(error.message);
      openDialog();
    }
  }

  // 種目マスタ更新関数
  const updateExercises = async (url: string) => {
    try {

      const apiUrl = new URL(url);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedExercise),
      });

      if (!response.ok) {
        // レスポンスがエラーの場合
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      // データを作成できたら詳細ダイアログを閉じる
      onClose();
      // 種目マスタを再取得
      fetchExercises();

    } catch (error: any) {
      setErrorMessage(error.message);
      openDialog();
    }
  }

  // 部位マスタ取得関数
  const fetchBodyParts = async () => {
    try {
      const apiUrl = new URL(process.env.NEXT_PUBLIC_FETCH_BODYPARTS_URL!);
      const response = await fetch(apiUrl);

      if (!response.ok) {
        // レスポンスがエラーの場合
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const result = await response.json();

      // 部位マスタの一覧をセット
      const bodyParts = result.map((item: { BodyPartId: number; Name: string }) => ({
        BodyPartId: item.BodyPartId,
        Name: item.Name,
      }));

      setBodyParts(bodyParts);
    } catch (error: any) {
      setErrorMessage(error.message);
      openDialog();
    }
  };

  // データ処理以外の関数
  // 初期表示
  useEffect(() => {
    fetchExercises();
  }, []);

  // 行をクリックしたときに呼ばれる関数
  const handleRowClick = async (exercise: Exercise | null = null) => {
    // 部位マスタを取得してリストボックスにセット
    await fetchBodyParts();
    // 選択した行のデータを設定
    setSelectedExercise(exercise);
    // 作成か更新かを設定
    setIsNewRecord(!exercise);
    if (exercise) {
      // 更新の場合、部位を選択
      const bodyPart = {
        BodyPartId: exercise?.BodyPart?.BodyPartId,
        Name: exercise?.BodyPartName || ''
      };
      setSelectedBodyPart(bodyPart)
    }
    // 詳細モーダルを開く
    onOpen();
  };

  // 種目名の変更を検知するイベント
  const handleExerciseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("種目変更")
    console.log(selectedExercise)
    if (selectedExercise) {
      setSelectedExercise({
        ...selectedExercise,
        Name: e.target.value,
      });
    } else {
      setSelectedExercise({
        ExercisePId: 0,
        Name: e.target.value,
        Weight: '',
        BodyPartName: '',
        BodyPart: { BodyPartId: 0, Name: '' }
      });
    }
  };

  // 重みの変更を検知するイベント
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    console.log("重み変更")
    console.log(selectedExercise)

    if (selectedExercise) {
      setSelectedExercise({
        ...selectedExercise,
        Weight: inputValue,
      });
    } else {
      setSelectedExercise({
        ExercisePId: 0,
        Name: '',
        Weight: inputValue,
        BodyPartName: '',
        BodyPart: { BodyPartId: 0, Name: '' }
      });
    }
  };

  // 部位の変更を検知するイベント
  const handleBodyPartChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // 選択されたBodyPartのidを取得
    const selectedBodyPartId = Number(e.target.value);
    // 選択されたBodyPartのnameを取得
    const selectedBodyPartName = bodyParts.find(part => part.BodyPartId === selectedBodyPartId)?.Name || '';
    console.log("部位変更")
    console.log(selectedExercise)
    if (selectedExercise) {
      setSelectedExercise({
        ...selectedExercise,
        BodyPartName: selectedBodyPartName,
        BodyPart: { BodyPartId: selectedBodyPartId, Name: selectedBodyPartName }
      });
    } else {
      setSelectedExercise({
        ExercisePId: 0,
        Name: '',
        Weight: '',
        BodyPartName: selectedBodyPartName,
        BodyPart: { BodyPartId: selectedBodyPartId, Name: selectedBodyPartName }
      });
    }
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
            {exerciseList.map((item) => (
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
            <Flex mt={4} direction="row" alignItems="center">
              <FormLabel minWidth="100px" marginRight="8px">
                種目名
              </FormLabel>
              <Input
                placeholder="Exercise Name"
                value={selectedExercise ? selectedExercise.Name : ''}
                onChange={handleExerciseChange}
              />
            </Flex>
            <Flex mt={4} direction="row" alignItems="center">
              <FormLabel minWidth="100px" marginRight="8px">
                重み
              </FormLabel>
              <Input
                type="text"
                placeholder="Weight"
                value={selectedExercise ? selectedExercise.Weight : ''}
                onChange={handleWeightChange}
              />
            </Flex>
            <Flex mt={4} direction="row" alignItems="center">
              <FormLabel minWidth="100px" marginRight="8px">
                部位
              </FormLabel>
              <Select
                placeholder="Select Body Part"
                value={selectedExercise?.BodyPart?.BodyPartId || ''}
                onChange={handleBodyPartChange}
              >
                {bodyParts.length > 0 ? (
                  bodyParts.map((part) => (
                    <option key={part.BodyPartId} value={part.BodyPartId}>
                      {part.Name}
                    </option>
                  ))
                ) : (
                  <option disabled>Loading...</option>
                )}
              </Select>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => { isNewRecord ? updateExercises(process.env.NEXT_PUBLIC_CREATE_EXERCISE_URL!) : updateExercises(process.env.NEXT_PUBLIC_UPDATE_EXERCISE_URL!) }}>
              {isNewRecord ? '作成' : '更新'}
            </Button>
            {isNewRecord ? null :
              <Button colorScheme="blue" mr={3} onClick={() => { updateExercises(process.env.NEXT_PUBLIC_DELETE_EXERCISE_URL!) }}>
                削除
              </Button>
            }
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              閉じる
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* エラーモーダル */}
      < ErrorModal
        isOpen={isDialogOpen}
        onClose={closeDialog}
        errorMessage={errorMessage}
        cancelRef={cancelRef}
      />
    </>
  );
}