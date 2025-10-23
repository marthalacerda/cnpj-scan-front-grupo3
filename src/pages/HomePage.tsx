import { Box, Button, Flex, Heading, VStack } from '@chakra-ui/react';
import { useRef, useState, FC, useEffect } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Txtespec from '@/components/ui/TextDescriptions';
import { useNavigate } from 'react-router-dom';
import { useExtraction } from '@/context/ExtractionContext';
// import MeuBotao from '../components/ui/button';
// import { extractBatchDataFromPDFs, uploadFileToBackend } from '@/api/cnpj';


const HomePage: FC = () => {

    // Hooks de contexto e navegação
    const navigate = useNavigate(); // inicia o hook de navegação
    const { addFile, resetBatch } = useExtraction(); // add o arquivo ao contexto
    
    // Hooks de estado local
	const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // Reseta o estado quando a HomePage é montada
    useEffect(() => {
        resetBatch();
    }, [resetBatch]);

    // 📁 Quando o arquivo é selecionado
    const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsLoading(true); // inicia o loading
        console.log('1. [LOG DE EVENTO] handleFileSelection foi chamado!');
        
        const files = event.target.files;
        
        if (files && files.length > 0) {
            // resetBatch();
            console.log(`2. [LOG DE ARQUIVO] ${files.length} arquivos detectados.`);
            
            // add arquivos temporariamente usando addFile do Contexto
            Array.from(files).forEach(file => {
                addFile(file);
            });

            // navega para a lista de arquivos
            navigate('/arquivos');

        } else {
            setIsLoading(false);
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
            multiple
          />

          {/* 🟢 Botão de seleção de arquivo */}
          <Button
            colorPalette="gray"
            size="lg"
            onClick={handleButtonClick}
            loading={isLoading}
            loadingText="Carregando arquivos..."
            variant="surface"
          >
            Selecionar Arquivos PDF
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