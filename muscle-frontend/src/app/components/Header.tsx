import { Box, Container, Flex, Heading, Spacer } from '@chakra-ui/react';
import { CustomMenu } from './Menu';

export const Header = () => {
    return (
        <Box bgColor="gray.100" px={0}>
            <Flex as="header" py="4" alignItems="center" position="relative">
                {/* メニューを左寄せする */}
                <Box position="absolute" left={4}> {/* メニューを絶対位置で左に固定 */}
                    <CustomMenu />
                </Box>

                {/* 画面中央にHeadingを配置する */}
                <Flex flexGrow={1} justifyContent="center">
                    <Heading size="md" textAlign="center">筋トレアプリ</Heading>
                </Flex>
            </Flex>
        </Box>
    );
};