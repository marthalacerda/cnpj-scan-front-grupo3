import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/header'; 
import Footer from '../components/ui/footer';
import { useExtraction } from '@/context/ExtractionContext';
import Tabela from '@/components/ui/tabela';

const FileListPage: FC = () => {

    // Usa a lista TEMP que tem os objetos File
    const { uploadedFilesTemp } = useExtraction();
    const navigate = useNavigate();

    // Cria o dataset para a tabela: apenas o nome e id
    const fileListData = useMemo(() => {
        return uploadedFilesTemp.map((file, index) => ({
            id: (index + 1),
            name: file.name,
            status: "Carregado", // status e hasError não vão aparecer - precisa para não dar erro
            hasError: false,
        }));
    }, [uploadedFilesTemp]);

    // Safety check
    if (fileListData.length === 0) {
        navigate('/');
        return null;
    }

    // Ação do Botão: Navega para a LoadingPage
    const handleExtractAll = () => {
        navigate(`/status/todos`);
    };

    return (
        <VStack w="100%" h="100%" align="center" justify="start" gap="10px"> 
            <Header title="CNPJ Scan" />

            <Box flexGrow={1} p={8} w="100%" textAlign="center">
                <Heading size="2xl" mb={6}>
                    {uploadedFilesTemp.length} arquivos prontos para processar:
                </Heading>

                <VStack 
                    spacing={3} 
                    mb={10} 
                    align="center" 
                    maxW="lg" 
                    mx="auto"
                >
                    <Tabela
                        data={fileListData}
                        isSimpleList={true}
                    />
                </VStack>
                
                {/* Botão de Extração */}
                <Button
                    size="lg"
                    onClick={handleExtractAll}
                >
                    Extrair Dados dos Cartões CNPJ
                </Button>
                
                               
            </Box>

            <Footer title="CNPJ Scan" copyrightText="Grupo 3 NEXT" />
        </VStack>
    );
};

export default FileListPage;
