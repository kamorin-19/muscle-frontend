import { Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import Link from 'next/link';

export const CustomMenu = () => {
  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} bg="teal.400" color="white" _hover={{ bg: "teal.500" }}>
        メニュー
      </MenuButton>
      <MenuList>
        <MenuItem as={Link} href="/home">ホーム</MenuItem>
        <MenuItem as={Link} href="/workout-record">筋トレ記録</MenuItem>
        <MenuItem as={Link} href="/weight-record">体重記録</MenuItem>
        <MenuItem as={Link} href="/exercise-master">種目マスタ</MenuItem>
        <MenuItem as={Link} href="/body-part-master">部位マスタ</MenuItem>
      </MenuList>
    </Menu>
  );
};