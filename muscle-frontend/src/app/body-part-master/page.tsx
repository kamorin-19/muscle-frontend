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

// BodyPart型の定義
interface BodyPart {
  id: number;
  name: string;
}

export default function BodyPartMasterPage() {

  // useStateでdataを管理
  const [data, setData] = useState<BodyPart[]>([]);
  // useStateで選択したdataを管理
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://localhost:7253/BodyPart/GetBodyParts');
        const result = await response.json();

        // APIレスポンスからidとnameを抽出してセット
        const formattedData = result.map((item: { bodyPartId: number; name: string }) => ({
          id: item.bodyPartId,
          name: item.name,
        }));

        setData(formattedData); // useStateのセッター関数を使用してdataを更新
      } catch (error) {
        console.error('データの取得に失敗しました', error);
      }
    };

    fetchData();
  }, []);

  // 行をクリックしたときに呼ばれる関数
  const handleRowClick = (bodyPart: BodyPart) => {
    setSelectedBodyPart(bodyPart); // 選択した行のデータを設定
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
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item) => (
              <Tr key={item.id} onClick={() => handleRowClick(item)} style={{ cursor: 'pointer' }}>
                <Td>{item.id}</Td>
                <Td>{item.name}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* モーダル */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>選択したボディパーツの詳細</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedBodyPart && (
              <>
                <p><strong>ID:</strong> {selectedBodyPart.id}</p>
                <p><strong>Name:</strong> {selectedBodyPart.name}</p>
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