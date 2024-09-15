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
  return (
    <>
      <TableContainer>
        <Button colorScheme="teal" onClick={() => console.log(1)} style={{ cursor: 'pointer' }}>
          取込
        </Button>
        <Button ml={4} colorScheme="teal" onClick={() => console.log(2)} style={{ cursor: 'pointer' }}>
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