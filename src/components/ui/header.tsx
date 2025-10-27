import React, { FC } from "react";
import { Flex, Image, Heading, Button } from "@chakra-ui/react";
import logoImage from "../../assets/logo.png";
import { Link } from "react-router-dom";

interface HeaderProps {
  title: string;
}

const Header: FC<HeaderProps> = ({ title }) => {

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      p={5}
      w="100%"
    >
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
    </Flex>
  );
};

export default Header;


