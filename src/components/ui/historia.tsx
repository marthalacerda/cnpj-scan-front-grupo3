import { Button, Menu, Portal } from "@chakra-ui/react";

const MenuHeader = () => {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button variant="solid" size="sm" rounded="full">
          Open
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="new-txt">New Text File</Menu.Item>
            <Menu.Item value="new-file">New File...</Menu.Item>
            <Menu.Item value="new-win">New Window</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default MenuHeader;