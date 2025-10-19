import { Box, Button, Flex, Heading, VStack } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import Header from '../components/ui/header';
import Footer from '../components/ui/footer';
// import MeuBotao from '../components/ui/button';
import Txtespec from '../components/ui/text_descriptions';
import { extractDataFromPDF, uploadFileToBackend } from '@/api/cnpj';
import { useNavigate } from 'react-router-dom';
import { useExtraction } from '@/context/ExtractionContext';


function HomePage() {

    // hooks de contexto e navegação
    const navigate = useNavigate(); // inicia o hook de navegação
    const { addFile } = useExtraction(); // add o arquivo ao contexto
    
    // hooks de estado local
	const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // 📁 Quando o arquivo é selecionado
    const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('1. [LOG DE EVENTO] handleFileSelection foi chamado!');
        const file = event.target.files?.[0];
        if (file) {
            // add o arquivo ao estado global
            addFile(file);
            // navega para a lista de arquivos page2
            navigate('/arquivos');
        }
        event.target.value = ''; // limpa input
    };

    // 🟡 Quando o botão é clicado
    const handleButtonClick = () => {
        console.log('0. [LOG DE CLIQUE] Botão clicado.');
        if (fileInputRef.current) {
        console.log('✅ fileInputRef encontrado. Abrindo seletor de arquivos...');
        fileInputRef.current.click();
        } else {
        console.error('❌ fileInputRef.current está nulo!');
        }
    };

  
    return (
// 1. Contêiner Principal: Deve ser um Flexbox (VStack/Flex) com altura total.
<VStack w="100%" h="100%" align="center" justify="center" gap="10px">  
 {/* Header */}
<Header title="CNPJ Scan" />

{/* 2. Conteúdo Principal: Deve ter flexGrow={1} para ocupar o espaço restante. */}
<Box 
 flexGrow={8} 
 p={8} 
 w="100%"
textAlign="center" 
 >
 <Heading size="3xl" mb={1}>
 Converta PDF para EXCEL.
</Heading>
        
        {/* INSERÇÃO DO TEXTO "Powered by CESAR School" */}
        <Box 
            fontSize="lg" 
            color="white" 
            mb={8} // Adiciona margem abaixo para separar do próximo elemento (Flex/MeuBotao)
            
        >
            Powered by CESAR School
        </Box>

<Flex align='center' justify='center'>
	<input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelection}
            style={{ display: 'none' }}
            accept=".pdf"
          />

          {/* 🟢 Botão de seleção de arquivo */}
          <Button
            colorPalette="gray"
            size="lg"
            onClick={handleButtonClick}
            isLoading={isLoading}
            loadingText="Enviando..."
            variant="surface"
          >
            Selecionar Arquivo PDF
          </Button>
 </Flex>
 <Txtespec/>
</Box>

 {/* 3. Footer: Deve ser o ÚLTIMO elemento e tem o 'mt="auto"' interno. */}
<Footer 
 title="CNPJ Scan" 
 copyrightText="Grupo 3 NEXT"
/>
 </VStack>
 )
}

export default HomePage;