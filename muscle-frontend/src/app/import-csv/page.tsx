"use client";

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

export default function ImportCsvPage() {

  // CSVのテンプレートをダウンロードする
  const handleDowdloadTemplate = () => {

    // CSVのヘッダー
    const header = `実施日,種目,1回目,2回目,3回目\n`;

    // Blobを使ってCSVファイルの生成
    const blob = new Blob([header], { type: 'text/csv;charset=utf-8;' });

    // ダウンロード用のリンクを作成
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'template.csv');

    // リンクをクリックしてCSVをダウンロード
    document.body.appendChild(link);
    link.click();

    // リンクを削除
    document.body.removeChild(link);
  }

  return (
    <>
      <TableContainer>
        <Button colorScheme="teal" onClick={() => console.log(1)} style={{ cursor: 'pointer' }}>
          取込
        </Button>
        <Button ml={4} colorScheme="teal" onClick={() => handleDowdloadTemplate() } style={{ cursor: 'pointer' }}>
          テンプレートダウンロード
        </Button>
        <br />
        <Table mt={4} variant="simple">
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

          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}