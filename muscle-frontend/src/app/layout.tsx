// app/layout.tsx
import { ChakraProvider, Box } from '@chakra-ui/react';
import { Header } from './components/Header';

export const metadata = {
  title: '筋トレアプリ',
  description: '筋トレ記録アプリケーション',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        <ChakraProvider>
          <Header />
          <Box mt={4} p={4}>
            {children}
          </Box>
        </ChakraProvider>
      </body>
    </html>
  );
}
