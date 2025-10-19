// src/pages/ResultPage.tsx

import { 
    Box, 
    Button, 
    Heading, 
    Text, 
    VStack
} from '@chakra-ui/react';
import { Table, Tbody, Thead, Tr, Th, Td } from '@chakra-ui/table';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/ui/header'; 
import Footer from '../components/ui/footer';
import { useExtraction } from '@/context/ExtractionContext';

const ResultPage: React.FC = () => {
    const { fileId } = useParams<{ fileId: string }>();
    const { uploadedFiles } = useExtraction();
    const navigate = useNavigate();

    const file = uploadedFiles.find(f => f.id === fileId);
    
    // UI de cores baseada no status
    // const statusColor = file?.result?.error ? 'red.400' : 'green.400';
    
    if (!file || !file.isProcessed || !file.result) {
        // Se não processado ou não encontrado, redireciona para a lista
        navigate('/arquivos'); 
        return null;
    }

    const { filename, status, error } = file.result;
    console.log(filename, status)
    const rowColor = error ? 'red.400' : 'green.400';

    const handleFinalStep = () => {
        // Lógica final: exportar, enviar para outro endpoint, etc.
        alert(`Próximo passo para o arquivo ${filename}!`);
    };

    return (
        <VStack w="100%" h="100%" align="center" justify="start" gap="10px"> 
            <Header title="CNPJ Scan" />

            <Box flexGrow={1} p={8} w="100%" textAlign="center">
                
                {/* Título Principal */}
                <Heading size="xl" mb={8}>
                    Status do Processamento
                </Heading>

                {/* Tabela de Resultados */}
                <Box 
                    maxW="800px" 
                    mx="auto" 
                    p={4} 
                    bg="rgba(0,0,0,0.2)" 
                    borderRadius="lg"
                    overflowX="auto" // Garante scroll em telas pequenas
                >
                    <Table variant="simple" colorScheme="whiteAlpha">
                        <Thead>
                            <Tr>
                                <Th color="white">Nome do Arquivo</Th>
                                <Th color="white">Status (Backend)</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {/* Linha do Arquivo Processado */}
                            <Tr>
                                {/* Coluna 1: Nome do Arquivo */}
                                <Td fontWeight="bold" color="white">
                                    {filename}
                                </Td>
                                {/* Coluna 2: Status vindo do JSON (pode ser sucesso ou a mensagem de erro) */}
                                <Td color={rowColor} fontWeight="bold">
                                    {status}
                                </Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </Box>
                
                {/* Nota de Erro Adicional (Opcional, para caso de erro) */}
                {error && (
                    <Text 
                        mt={4} 
                        fontSize="md" 
                        color="red.300" 
                        textAlign="center"
                    >
                        {/* *A extração não pôde ser concluída. Verifique a mensagem do Status. */}
                    </Text>
                )}

                {/* Botão para a Etapa Final */}
                <Button
                    mt={10}
                    size="lg"
                    onClick={handleFinalStep}
                    isDisabled={!!error} // Desabilita se houver erro
                >
                    Etapa Final do Sistema
                </Button>
                
            </Box>

            <Footer title="CNPJ Scan" copyrightText="Grupo 3 NEXT" />
        </VStack>
    );
};

export default ResultPage;