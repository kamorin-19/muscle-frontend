"use client";
import { ChakraProvider, Box } from '@chakra-ui/react';
import { Header } from './components/Header';

export default function Home() {
  return (
    <ChakraProvider>
      <Box mt={4} p={4}>
        <p>メインページのコンテンツ</p>
      </Box>
    </ChakraProvider>
  );
}
