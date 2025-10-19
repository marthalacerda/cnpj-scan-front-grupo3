import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/header'; 
import Footer from '../components/ui/footer';
import { useExtraction } from '@/context/ExtractionContext';

const ProcessPage: React.FC = () => {
    const { extractionResult } = useExtraction();
    const navigate = useNavigate();

    // Se não há dados, manda o usuário de volta para o upload
    if (!extractionResult) {
        // Redireciona de volta para a HomePage se acessar diretamente
        navigate('/');
        return null; 
    }

    const { filename, status, extracted_data } = extractionResult;
    
    const handleNextStep = () => {
        // Lógica futura: chamar o endpoint que usa 'extracted_data'
        alert("Botão clicado! Próximo passo em desenvolvimento.");
    };
    
    return (
        <VStack w="100%" h="100%" align="center" justify="start" gap="10px"> 
            <Header title="CNPJ Scan" />

            <Box flexGrow={1} p={8} w="100%" textAlign="center">
                
                <Heading size="2xl" mb={6}>
                    Processamento Concluído
                </Heading>

                {/* Nome do Arquivo */}
                <Text fontSize="xl" mb={2} fontWeight="bold">
                    Arquivo: {filename}
                </Text>

                {/* Status da Extração */}
                <Text fontSize="lg" color="green.300" mb={8}>
                    Status: {status}
                </Text>
                
                {/* Visualização de Dados (apenas para exemplo) */}
                <VStack spacing={2} align="center" maxW="400px" mx="auto" p={4} borderRadius="lg" bg="rgba(0,0,0,0.1)">
                    <Text fontWeight="bold">Dados Extraídos (Exemplo):</Text>
                    {/* Aqui você mostraria uma tabela ou cards com os dados */}
                    {extracted_data.numero_de_inscricao && (
                        <Text>CNPJ: {extracted_data.numero_de_inscricao}</Text>
                    )}
                    {extracted_data.nome_empresarial && (
                        <Text>Nome empresarial: {extracted_data.nome_empresarial}</Text>
                    )}
                </VStack>

                {/* Botão para o Próximo Passo */}
                <Button
                    mt={10}
                    size="lg"
                    onClick={handleNextStep}
                    // Adicione isLoading, etc. se necessário
                >
                    Próximo Passo / Enviar Dados
                </Button>
                
            </Box>

            <Footer 
                title="CNPJ Scan" 
                copyrightText="Grupo 3 NEXT"
            />
        </VStack>
    );
};

export default ProcessPage;