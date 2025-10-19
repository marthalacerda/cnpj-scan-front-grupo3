import { Box, Grid, GridItem, Text, Container, Heading } from '@chakra-ui/react';
import React from 'react';

// --- Dados dos textos descritivos ---
const textData = [
  {
    title: "Dados de CNPJ na mão",
    description: "Tenha os dados de CNPJ que você precisa em mãos, em segundos. Nossa ferramenta lê seus PDFs de CNPJ e os transforma em um arquivo CSV limpo e estruturado. Maximize sua eficiência e comece a analisar seus dados imediatamente.",
  },
  {
    title: "Sua segurança é a nossa prioridade",
    description: "O sistema funciona como um processo fechado: seu PDF chega, é convertido em CSV e é imediatamente apagado de nossos servidores. Não retemos cópias dos seus CNPJs. Você pode converter seus arquivos com a certeza de que eles não ficarão armazenados.",
  },
];

const Txtespec: React.FC = () => {
  return (
    <Container maxW="6xl" py={10}>
      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
        gap={{ base: 8, md: 6 }}
        textAlign={'center'}
      >
        {textData.map((item, index) => (
          <GridItem key={index} p={6} borderLeft={{ md: index === 1 ? '1px solid' : 'none' }} borderColor="white">
            <Heading as="h3" size="2xl" mb={2} color="white">
              {item.title}
            </Heading>
            <Text fontSize="md" color="white">
              {item.description}
            </Text>
          </GridItem>
        ))}
      </Grid>
    </Container>
  );
};
export default Txtespec;