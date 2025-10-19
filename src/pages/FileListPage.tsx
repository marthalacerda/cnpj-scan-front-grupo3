// src/pages/FileListPage.tsx

import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/header'; 
import Footer from '../components/ui/footer';
import { useExtraction } from '@/context/ExtractionContext';

const FileListPage: React.FC = () => {
    const { uploadedFiles } = useExtraction();
    const navigate = useNavigate();

    // Pegamos o último arquivo upado para o foco de UX
    const latestFile = uploadedFiles[uploadedFiles.length - 1]; 

    // Se a lista estiver vazia (acesso direto), volta
    if (!latestFile) {
        navigate('/');
        return null;
    }

    // Ação do Botão: Navega para a Page 3 (Processamento)
    const handleExtract = () => {
        // Redireciona para a página de status, levando o ID do arquivo na URL
        navigate(`/status/${latestFile.id}`); 
    };

    return (
        <VStack w="100%" h="100%" align="center" justify="start" gap="10px"> 
            <Header title="CNPJ Scan" />

            <Box flexGrow={1} p={8} w="100%" textAlign="center">
                <Heading size="2xl" mb={6}>
                    Arquivo Pronto para Extração
                </Heading>

                {/* Nome do Arquivo */}
                <Text fontSize="2xl" mb={10} fontWeight="bold" color="yellow.300">
                    {latestFile.name}
                </Text>
                
                {/* Botão de Extração */}
                <Button
                    size="lg"
                    onClick={handleExtract}
                >
                    Extrair Dados do CNPJ
                </Button>
                
                {/* Opcional: Lista de todos os arquivos upados */}
                {/* <VStack mt={10}>
                    {uploadedFiles.map(file => <Text key={file.id}>{file.name}</Text>)}
                </VStack> */}
                
            </Box>

            <Footer title="CNPJ Scan" copyrightText="Grupo 3 NEXT" />
        </VStack>
    );
};

export default FileListPage;
