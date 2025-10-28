import { VStack, Flex, Heading, Box, Text, Center, Spinner, Button } from "@chakra-ui/react";
import { useEffect, useState, useMemo, FC } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import Home from "../components/ui/Home";
import DynamicTable from "../components/ui/DynamicTable";
import Header from '../components/ui/header';
import Footer from '../components/ui/footer';
import DownloadCSV from "../components/ui/DownloadCSV";

import { useExtraction } from "@/context/ExtractionContext";
import { getCsvReport } from "@/api/reports";


const ReportPage: FC = () => {

    const navigate = useNavigate();
    const location = useLocation();

    // Pega a lista final de resultados do backend
    const { processedResults } = useExtraction();

    const [csvContent, setCsvContent] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Pega os campos selecionados
    const selectedFields = (location.state as { selectedFields?: string[] })?.selectedFields || [];

    // O total é o número de resultados que recebemos
    const totalFilesCount = processedResults.length;
    
    // Contagem dos dados válidos para UI
    const validDataCount = useMemo(() => {
        return processedResults.filter(file => !file.error).length;
    }, [processedResults]);

    
    // 2. LÓGICA DO FETCH DO CSV

    useEffect(() => {
        // Safety check - Se não tem resultados no contexto (erro na LoadingPage)
        if (totalFilesCount === 0) {
            navigate('/resultado'); // volta para a process page p avaliar
            return;
        }

        // Safety check - Se não tem campos selecionados
        // (a processpage está garantindo que isso não aconteça)
        if (selectedFields.length === 0) {
            alert("Erro interno: Nenhum campo chegou para gerar o CSV");
            navigate('/resultado');
            return;
        }

        // Chama a camada de api
        const fetchReport = async () => {
            setIsLoading(true);

            // Envia o array processedResults e os campos para o back
            const result = await getCsvReport(processedResults, selectedFields);

            setIsLoading(false);

            if (result.success && result.data) {
                setCsvContent(result.data);
            } else {
                setCsvContent(`Erro: ${result.message}`);
                alert(`ERRO FATAL ao gerar CSV: ${result.message}`);                
            }
        };

        if (!csvContent && !isLoading) {
            fetchReport();
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFields.length, totalFilesCount])


    // Mensagem de espera enquanto estiver carregando
    if (isLoading) {
        return (
            <VStack w="100%" h="100%" align="center" justify="center">
                <Spinner size="xl" color="white" />
                <Heading size="xl">Gerando seu Relatório Personalizado...</Heading>
                <Text>De {totalFilesCount} arquivos, {validDataCount} estão sendo incluídos...</Text>
            </VStack>
        );
    }

    // 3. Montagem do layout com a injeção da lógica
    
    return (
        <VStack w="100%" minH="100vh" align="center">
        <Header title="CNPJ Scan" />
        <Box p="20px" w="100%" textAlign="center">
            <Heading size="3xl" spaceY={-5}>
            Converta PDF para EXCEL
            </Heading>
            <Text mb="20px" fontSize="md" color="white">
            Powered by Cesar School
            </Text>

            {/* ⚠️ INJEÇÃO 1: Passamos o conteúdo CSV (texto) para a DynamicTable */}
            <Center paddingY={8} paddingX={8}>
                <DynamicTable
                    csvContent={csvContent}
                    selectedFields={selectedFields}
                />
            </Center>
            <Text fontSize="md" color="white">
                {validDataCount} de {totalFilesCount} arquivos na tabela criada
            </Text>
            {/* ⚠️ INJEÇÃO 2: Passamos o conteúdo CSV (texto) e status para o botão de download */}
            <Flex align="top-center" justify="center" gap={7} mt={8}>

                <Button
                    bg= "white"
                    color= "#036DC5"
                    _hover={{ bg: "#bed8f1ff" }}
                    size="lg"
                    rounded="md"
                    boxShadow="md"
                    onClick={() => navigate('/resultado')}
                >
                    &larr; Voltar

                </Button>

                <Home navigateTo="/"/>

                <DownloadCSV
                    csvContent={csvContent}
                    isDisabled={!csvContent || csvContent.startsWith("ERRO")}
                />
            </Flex>
        </Box>

        <Footer 
            title="Página 3" 
            copyrightText="Grupo 3 NEXT"
            />
        </VStack>
    );
}

export default ReportPage;