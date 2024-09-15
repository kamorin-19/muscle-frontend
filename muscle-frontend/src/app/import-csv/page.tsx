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

// 取込データの定義
interface ImportRecord {
  EnforcementDay: Date;
  ExerciseName: string;
  FirstSetCount: number;
  SecondSetCount: number;
  ThirdSetCount: number;
}

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

  // 取り込んだCSVデータを日々の記録に登録する
  const createDailyRecords = async () => {

    // CSVのヘッダーを除いた部分を取得
    const formattedData = csvData.slice(1).map((row) => ({
      EnforcementDay: new Date(row[0]).toISOString().split('T')[0],
      ExerciseName: row[1],
      FirstSetCount: parseInt(row[2]),
      SecondSetCount: parseInt(row[3]),
      ThirdSetCount: parseInt(row[4]),
    }));
    
    for (let i = 0; i < formattedData.length; i++) {

      console.log(JSON.stringify(formattedData[i]))
      try {
        const response = await fetch('https://localhost:7253/ImportCsv/AddDailyRecords', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedData[i]), // JSON形式に変換して送信
        });
  
        if (!response.ok) {
          throw new Error('Failed to send data');
        }
      } catch (e) {
        console.error(e);
      }
    }


/*console.log(JSON.stringify(formattedData))
    try {
      const response = await fetch('https://localhost:7253/ImportCsv/AddDailyRecords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData), // JSON形式に変換して送信
      });

      if (!response.ok) {
        throw new Error('Failed to send data');
      }
    } catch (e) {
      console.error(e);
    }*/
    /*const records = csvData.slice(1).map(async (row) => {
      const record: ImportRecord = {
        EnforcementDay: new Date(row[0]),
        ExerciseName: row[1],
        FirstSetCount: parseInt(row[2]),
        SecondSetCount: parseInt(row[3]),
        ThirdSetCount: parseInt(row[4]),
      };
    }*/

    /* try {

       const response = await fetch('/api/upload', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(records), // JSON形式に変換して送信
       });
 
       if (!response.ok) {
         throw new Error('Failed to send data');
       }

     } catch (e) {
       console.error(e);
     }
   });*/
  }

  return (
    <>
      <TableContainer>
        <Input type="file" accept=".csv" onChange={handleImport} />
        <br />
        <Button mt={4} colorScheme="teal" onClick={() => handleDowdloadTemplate()} style={{ cursor: 'pointer' }}>
          テンプレートダウンロード
        </Button>
        <Button ml={4} colorScheme="teal" onClick={() => createDailyRecords()} style={{ cursor: 'pointer' }}>
          登録
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