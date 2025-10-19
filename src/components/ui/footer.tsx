import React, { FC } from "react";
// Usaremos Flex e Text (em vez de Heading e Image) no rodapé
import { Flex, Text, Box } from "@chakra-ui/react";

interface FooterProps {
  title: string;
  /** Texto de direitos autorais (opcional) */
  copyrightText?: string;
}

// 2. Criando o Footer com o Flex do Chakra
const Footer: FC<FooterProps> = ({ title, copyrightText }) => {
  // Pega o ano atual para o rodapé
  const currentYear = new Date().getFullYear();

  // Define o texto de direitos autorais, usando o title se o copyrightText não for fornecido
  const finalCopyright = copyrightText || title;

  return (
    // Use Flex para o contêiner principal do rodapé
    <Flex
      as="footer" // Trata o Flex como um <footer> semântico
      justify="start"
      w="100%" // Ocupa toda a largura do contêiner
      p="5px" // Padding (espaçamento interno)
      mt="auto" // Garante que o rodapé fique sempre na parte inferior se for usado em um contêiner Flex/Grid principal
      color="white" // Cor do texto branca
    >
      <Box textAlign="start">
        {/* Título ou nome principal do aplicativo */}
        <Text fontWeight="bold" fontSize="lg" mb={-5} p="5px">
          {title}
        </Text>

        {/* Linha de direitos autorais */}
        <Text fontSize="sm" p="5px">
          &copy; {currentYear} {finalCopyright}. Todos os direitos reservados.
        </Text>
      </Box>
    </Flex>
  );
};

export default Footer;