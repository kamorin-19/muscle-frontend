import { Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import Link from 'next/link';

export const CustomMenu = () => {
  return (
    <Menu>
      <MenuButton as={Button} bg="teal.400" color="white" _hover={{ bg: "teal.500" }}>
        メニュー
      </MenuButton>
      <MenuList>
        <MenuItem as={Link} href="/templates/workout-record">筋トレ記録</MenuItem>
        <MenuItem as={Link} href="/templates/weight-record">体重記録</MenuItem>
        <MenuItem as={Link} href="/templates/exercise-master">種目マスタ</MenuItem>
        <MenuItem as={Link} href="/templates/body-part-master">部位マスタ</MenuItem>
        <MenuItem as={Link} href="/templates/import-csv">CSV取込</MenuItem>
      </MenuList>
    </Menu>
  );
};