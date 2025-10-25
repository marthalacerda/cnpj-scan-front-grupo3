import { Box, Button, Heading, Flex, Text, VStack, Spinner } from '@chakra-ui/react';
import { useState, useMemo, FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header'; 
import Footer from '../components/ui/Footer';
import SelectBox from '@/components/ui/SelectBox';
import Tabela from '@/components/ui/Tabela';
import { useExtraction } from '@/context/ExtractionContext';
import { FIELD_KEYS, AVAILABLE_FIELDS } from '@/constants/fields';
import Home from '@/components/ui/Home';


const ProcessPage: FC = () => {

    // Pega diretamente o array de resultados da extração
    const { processedResults, isBatchComplete  } = useExtraction();
    const navigate = useNavigate();

    // Estado local para armazenar os campos selecionados
    const [selectedFields, setSelectedFields] = useState<string[]>([]);

    // Lógica de Status
    // Arquivos válidos não tem a flag "error" do backend
    const validFilesForReport = useMemo(() => {
        return processedResults.filter(file => !file.error);
    }, [processedResults]);

    // O total é o número de resultados que recebemos
    const totalProcessedCount = processedResults.length;


    //----------------
    
    // Safety check
    useEffect(() => {
        if (totalProcessedCount === 0 && isBatchComplete) {            
            console.log('DEBUG - Redirecionando para Home: Processo finalizado sem dados');
            navigate('/');
        }
    }, [totalProcessedCount, navigate]);

    if (totalProcessedCount === 0) {
        return null;
    }

    //-----------------

   
    // Criação da função de atualização que será passada para o SelectBox
    const handleFieldsUpdate = (fields: string[]) => {
        setSelectedFields(fields);
    };

    // Criação do dataset para a Tabela
    const tableStatusData = useMemo(() => {
        return processedResults.map(file => ({
            id: processedResults.indexOf(file),
            name: file.filename,
            status: file.status,
            hasError: file.error || false,
        }));
    }, [processedResults]);

    // Regra de negócio: Nenhum campo selecionado = todos os campos na tabela
    const handleNextStep = () => {
        let fieldsToSend: string[] = selectedFields.length === 0 ? FIELD_KEYS : selectedFields;
        navigate('/relatorio', { state: { selectedFields: fieldsToSend } });
    };

    
    return (
        <VStack w="100%" h="100%" align="center" justify="start" gap="10px">

            <Header title="CNPJ Scan" />

            <Box flexGrow={1} p={4} w="100%" textAlign="center">
                
                <Heading size="2xl" mb={8}>
                    Processamento Concluído
                </Heading>

                {/* INJEÇÃO 1: Tabela de status */}
                <Flex align="center" justify="center" mb={4}>
                    <Tabela data={tableStatusData} />
                </Flex>

                {/* Informação sobre quantos arquivos foram válidos */}
                <Text fontSize="lg" mb={8} color={validFilesForReport.length > 0 ? 'green.300' : 'red.300'}>
                    {validFilesForReport.length} de {totalProcessedCount} arquivos prontos para o relatório CSV.
                </Text>
                

                {/* INJEÇÃO 2: SelectBox se tiver arquivos válidos */}
                <Flex align="center" justify="center" mb={8}>
                    {validFilesForReport.length > 0 ? (
                        <SelectBox
                            availableFields={FIELD_KEYS}
                            selectedFields={selectedFields}
                            onFieldsChange={handleFieldsUpdate}
                            fieldMapping={AVAILABLE_FIELDS}
                        />
                    ) : (
                        // Mensagem de erro se não tiver arquivos válidos
                        <Text color="red.300" fontSize="lg">
                            Nenhum arquivo válido para configuração de relatório.
                        </Text>
                    )}
                    
                </Flex>
                
                <Flex align="top-center" justify="center" gap={7} mt={8}>

                <Home navigateTo='/'/>

                {/* Botão para o Próximo Passo */}
                <Button
                    // mt={10}
                    bg= "white"
                    color= "#036DC5"
                    _hover={{ bg: "#bed8f1ff" }}
                    size="lg"
                    rounded="md"
                    boxShadow="md"
                    onClick={handleNextStep}
                    disabled={validFilesForReport.length === 0}
                    // isDisabled={validFilesForReport.length === 0}
                    // Adicione isLoading, etc. se necessário
                >
                    Gerar Tabela CSV
                </Button>
                
                </Flex>

                
            </Box>

            <Footer 
                title="CNPJ Scan" 
                copyrightText="Grupo 3 NEXT"
            />
        </VStack>
    );
};

export default ProcessPage;