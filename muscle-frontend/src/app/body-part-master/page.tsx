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
  Input
} from '@chakra-ui/react';

// BodyPart型の定義
interface BodyPart {
  BodyPartId: number;
  Name: string;
}

export default function BodyPartMasterPage() {

  // useStateでdataを管理
  const [data, setData] = useState<BodyPart[]>([]);
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
          BodyPartId: item.bodyPartId,
          Name: item.name,
        }));

        setData(formattedData); // useStateのセッター関数を使用してdataを更新
      } catch (error: any) {
        setErrorMessage(error.message);
        openDialog();
      }
    };

    fetchData();
  }, []);

  // 行をクリックしたときに呼ばれる関数
  const handleRowClick = useCallback((bodyPart: BodyPart | null = null) => {
    // 選択した行のデータを設定
    setSelectedBodyPart(bodyPart);
    // 作成か更新かを設定
    setIsNewRecord(!bodyPart);
    // モーダルを開く
    onOpen();
  }, [onOpen]);

  // マスタ作成のリクエストを投げる
  const createBodyPart = useCallback(async () => {
    try {
      const response = await fetch('https://localhost:7253/BodyPart/AddBodyParts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedBodyPart),
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
              BodyPartId: item.bodyPartId,
              Name: item.name,
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
  }, [selectedBodyPart]);

  // マスタ更新のリクエストを投げる
  const updateBodyPart = useCallback(async () => {
    try {
      const response = await fetch('https://localhost:7253/BodyPart/UpdateBodyParts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedBodyPart),
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
              BodyPartId: item.bodyPartId,
              Name: item.name,
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
  }, [selectedBodyPart]);

  // マスタ削除のリクエストを投げる
  const deleteBodyPart = useCallback(async () => {
    try {
      const response = await fetch('https://localhost:7253/BodyPart/DeleteBodyParts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedBodyPart),
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
              BodyPartId: item.bodyPartId,
              Name: item.name,
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
  }, [selectedBodyPart]);

  return (
    <>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>部位名</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item) => (
              <Tr key={item.BodyPartId} onClick={() => handleRowClick(item)} style={{ cursor: 'pointer' }}>
                <Td>{item.Name}</Td>
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
          <ModalHeader>{isNewRecord ? '部位マスタ作成' : '部位マスタ更新'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* selectedBodyPartが設定されている場合はそのnameを表示し、そうでなければnullを表示する */}
            <Input
              placeholder="Body Part Name"
              value={selectedBodyPart ? selectedBodyPart.Name : ''}
              onChange={(e) => {
                // selectedBodyPartがnullでない場合はそのnameを更新
                if (selectedBodyPart) {
                  setSelectedBodyPart({ ...selectedBodyPart, Name: e.target.value });
                } else {
                  // nullの場合、IDに0を設定して新しいオブジェクトを作成
                  setSelectedBodyPart({ BodyPartId: 0, Name: e.target.value });
                }
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => { isNewRecord ? createBodyPart() : updateBodyPart() }}>
              {isNewRecord ? '作成' : '更新'}
            </Button>
            {isNewRecord ? null :
              <Button colorScheme="blue" mr={3} onClick={() => { deleteBodyPart() }}>
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
      <AlertDialog
        isOpen={isDialogOpen} // 変更された変数名を使用
        leastDestructiveRef={cancelRef}
        onClose={closeDialog} // 変更された変数名を使用
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              エラー
            </AlertDialogHeader>

            <AlertDialogBody>
              {errorMessage}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeDialog}> {/* 変更された変数名を使用 */}
                閉じる
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}