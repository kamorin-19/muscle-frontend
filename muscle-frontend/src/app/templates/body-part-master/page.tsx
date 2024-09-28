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
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
} from '@chakra-ui/react';

import { BodyPart } from '@/app/types/types';
import ErrorModal from '@/app/components/ErrorModal';

export default function BodyPartMasterPage() {

  // state定義
  // 部位一覧を管理
  const [bodyPartList, setBodyPartList] = useState<BodyPart[]>([]);
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

      setBodyPartList(bodyParts);

    } catch (error: any) {
      setErrorMessage(error.message);
      openDialog();
    }
  };

  // 部位マスタ更新関数
  const updateBodyPart = async (url: string) => {
    try {
      const apiUrl = new URL(url);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedBodyPart),
      });

      if (!response.ok) {
        // レスポンスがエラーの場合
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      // データを作成できたら詳細ダイアログを閉じる
      onClose();
      // 部位マスタを再取得
      fetchBodyParts();

    } catch (error: any) {
      setErrorMessage(error.message);
      openDialog();
    }
  };

  // データ処理以外の関数
  // 初期表示
  useEffect(() => {
    fetchBodyParts();
  }, []);

  // 行をクリックしたときに呼ばれる関数
  const handleRowClick = (bodyPart: BodyPart | null = null) => {
    // 選択した行のデータを設定
    setSelectedBodyPart(bodyPart);
    // 作成か更新かを設定
    setIsNewRecord(!bodyPart);
    // 詳細モーダルを開く
    onOpen();
  };

  // 選択した部位が変更されたときに呼ばれる関数
  const selectdBodyPartChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    // selectedBodyPartがnullでない場合はそのnameを更新
    if (selectedBodyPart) {
      setSelectedBodyPart({ ...selectedBodyPart, Name: e.target.value });
    } else {
      // nullの場合、IDに0を設定して新しいオブジェクトを作成
      setSelectedBodyPart({ BodyPartId: 0, Name: e.target.value });
    }
  }


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
            {bodyPartList.map((item) => (
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
            <Flex direction="row" alignItems="center">
              <FormLabel minWidth="100px" marginRight="8px">
                部位名
              </FormLabel>
              <Input
                placeholder="Body Part Name"
                value={selectedBodyPart ? selectedBodyPart.Name : ''}
                onChange={selectdBodyPartChanged}
              />
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => { isNewRecord ? updateBodyPart(process.env.NEXT_PUBLIC_CREATE_BODYPART_URL!) : updateBodyPart(process.env.NEXT_PUBLIC_UPDATE_BODYPART_URL!) }}>
              {isNewRecord ? '作成' : '更新'}
            </Button>
            {isNewRecord ? null :
              <Button colorScheme="blue" mr={3} onClick={() => { updateBodyPart(process.env.NEXT_PUBLIC_DELETE_BODYPART_URL!) }}>
                削除
              </Button>
            }
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              閉じる
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal >

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