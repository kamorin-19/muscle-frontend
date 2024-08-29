import {
    Box,
    Flex,
    Container,
    Heading,
} from '@chakra-ui/react';
import { CustomMenu } from './Menu'; 

export const Header = () => {    
    return (
        <Box px={4} bgColor="gray.100">
            <Container maxW="container.lg">
                <Flex as="header" py="4" justifyContent="space-between" alignItems="center">
                <CustomMenu />
                <Heading size="md">筋トレアプリ</Heading>
                </Flex>
            </Container>
        </Box>
    );
}