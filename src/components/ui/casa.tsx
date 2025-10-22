import React, { FC } from "react";
import { IconButton, Flex, Link } from "@chakra-ui/react";
import { IoHomeOutline } from "react-icons/io5";
import {Link as RouterLink } from 'react-router-dom'


interface HomeProps {
  navigateTo: string;
}


const Home: FC<HomeProps> = ({ navigateTo }) => {
  return (

    // Usa o link do Router para navvegação interna
    <Link as={RouterLink} to={navigateTo} _hover={{ textDecoration: "none" }}>
      <IconButton
        bg="white"
        aria-label="Ir para home"
        boxShadow="md"
        rounded="full"
        variant="solid"
        size="lg"
      >
        <IoHomeOutline color="#036DC5" />
      </IconButton>
    </Link>
  );
};

export default Home;