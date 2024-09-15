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
  Select,
  useToast
} from '@chakra-ui/react';

import { useState } from 'react';

export default function ImportCsvPage() {

  // stateとtoastの初期化
  const [csvData, setCsvData] = useState<string[][]>([]);
  const toast = useToast();

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

  // CSVをインポートして画面に表示する
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {

    const file = event.target.files?.[0];
    // ファイルが選択されていない場合は何もしない
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n').map((row) => row.split(','));

      // CSVのヘッダーと1行目の値を確認
      if (rows.length < 2 || rows[0].length !== 5) {
        toast({
          title: 'Invalid CSV format',
          description: 'The CSV should have 5 columns: 実施日, 種目, 1回目, 2回目, 3回目',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      // CSVデータを状態に保存
      setCsvData(rows); 
    }

    // 文字コードUTF-8でファイルを読み込み
    reader.readAsText(file, 'UTF-8');
  }

  return (
    <>
      <TableContainer>
        <Input type="file" accept=".csv" onChange={handleImport} />
        <br />
        <Button mt={4} colorScheme="teal" onClick={() => handleDowdloadTemplate()} style={{ cursor: 'pointer' }}>
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
            {csvData.map((row, rowIndex) => (
              <Tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <Td key={cellIndex}>{cell}</Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}