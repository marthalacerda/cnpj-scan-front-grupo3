// src/pages/LoadingPage.tsx

import { Box, Spinner, Heading, VStack, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Pega o ID da URL
import { useExtraction } from '@/context/ExtractionContext';
import { extractDataFromPDF } from '@/api/cnpj'; // A função de extração

const LoadingPage: React.FC = () => {
    const { fileId } = useParams<{ fileId: string }>(); // Pega o ID
    const { uploadedFiles, updateFileResult } = useExtraction();
    const navigate = useNavigate();

    // Encontra o arquivo original no estado
    const fileToProcess = uploadedFiles.find(f => f.id === fileId);
    
    useEffect(() => {
        if (!fileToProcess || fileToProcess.isProcessed) {
            // Se já processado ou não encontrado, vai para o status (Page 4)
            navigate(`/resultado/${fileId}`);
            return;
        }

        const runExtraction = async () => {
            const fileObject = fileToProcess.fileObject;
            
            // 1. Chama a API de extração
            const result = await extractDataFromPDF(fileObject);
            console.log('### ', result)
            if (result.success && result.data) {
                // 2. Salva o resultado no estado global (Contexto)
                updateFileResult(fileToProcess.id, result.data); 
            } else {
                // 3. Trata falhas de rede/API: cria um "erro de processamento" para salvar no estado
                const dummyErrorResult = {
                    filename: fileToProcess.name,
                    status: result.message,
                    error: result.message
                } as any; // Usamos 'any' temporariamente para simplificar
                updateFileResult(fileToProcess.id, dummyErrorResult);
            }
            
            // 4. Navega para a Page 4 (Resultado/Status)
            navigate(`/resultado/${fileToProcess.id}`);
        };

        runExtraction();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fileId, fileToProcess?.isProcessed, navigate]); // Roda apenas quando o componente monta

    if (!fileToProcess) {
        return <Text color="red">Arquivo não encontrado.</Text>;
    }

    // UI de Loading
    return (
        <VStack w="100%" h="100%" align="center" justify="center" spacing={8}>
            <Spinner size="xl" color="white" thickness="4px" />
            <Heading size="xl">Processando Dados do Arquivo...</Heading>
            <Text fontSize="lg">
                <Text as="span" fontWeight="bold">{fileToProcess.name}</Text>
            </Text>
            {/* Opcional: Adicionar a "figurinha animada" aqui */}
        </VStack>
    );
};

export default LoadingPage;
