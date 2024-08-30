"use client";

import { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';

// WorkoutRecord型の定義
interface DailyRecord {
  id: number;
  enforcementDay: Date;
  exerciseName: string;
  firstSetCount: number;
  secondSetCount: number;
  thirdSetCount: number;
}

export default function WorkoutRecordPage() {

  // useStateでdataを管理
  const [data, setData] = useState<DailyRecord[]>([]);

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

        const formattedData = [
          {
            id: 1,
            enforcementDay: new Date('2024-08-30'),
            exerciseName: 'バーベルスクワット',
            firstSetCount: 10,
            secondSetCount: 11,
            thirdSetCount: 12,
          },
          {
            id: 2,
            enforcementDay: new Date('2024-08-30'),
            exerciseName: 'ブルガリアンスクワット',
            firstSetCount: 10,
            secondSetCount: 11,
            thirdSetCount: 12,
          },
          {
            id: 3,
            enforcementDay: new Date('2024-08-30'),
            exerciseName: 'ダンベルプレス',
            firstSetCount: 10,
            secondSetCount: 11,
            thirdSetCount: 12,
          },
        ];

        setData(formattedData); // useStateのセッター関数を使用してdataを更新
      } catch (error) {
        console.error('データの取得に失敗しました', error);
      }
    };

    fetchData();
  }, []);

  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>id</Th>
            <Th>enforcementDay</Th>
            <Th>exerciseName</Th>
            <Th>firstSetCount</Th>
            <Th>secondSetCount</Th>
            <Th>thirdSetCount</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item) => (
            <Tr key={item.id}>
              <Td>{item.id}</Td>
              <Td>{item.enforcementDay.toDateString()}</Td>
              <Td>{item.exerciseName}</Td>
              <Td>{item.firstSetCount}</Td>
              <Td>{item.secondSetCount}</Td>
              <Td>{item.thirdSetCount}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}