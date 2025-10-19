// src/components/ui/header.tsx (Chakra UI v3.2)
import React, { FC } from "react";
import { Flex, Image, Heading, Button } from "@chakra-ui/react";
import { useColorMode, useColorModeValue } from "./color-mode";
import MenuHeader from "./historia";
import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import logoImage from "../../assets/logo.png";
import { Link } from "react-router-dom";



const Header: FC<HeaderProps> = ({ title }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const ThemeIcon = useColorModeValue(CiLight, MdDarkMode);

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      p={5}
      w="100%"
    >
      {/* Lado esquerdo: logo + título */}
      <Link to="/" style={{ textDecoration: 'none' }}>
      <Flex align="center" gap={4} cursor="pointer">
        <Image
          src={logoImage}
          alt={`${title} logo`}
          h="90px"
          borderRadius="xl"
        />
        <Heading as="h1" size="3xl" fontFamily="Rag 123">
          {title}
        </Heading>
      </Flex>
      </Link>

      {/* Lado direito: botões */}
      <Flex gap={2} align="center">
        <MenuHeader />
        <Button onClick={toggleColorMode} variant="ghost" rounded="full">
          <ThemeIcon size={20} />
        </Button>
      </Flex>
    </Flex>
  );
};

export default Header;