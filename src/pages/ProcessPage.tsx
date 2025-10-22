import { Box, Button, Heading, Flex, Text, VStack } from '@chakra-ui/react';
import { useState, useMemo, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/header'; 
import Footer from '../components/ui/footer';
import SelectBox from '@/components/ui/selectbox';
import Tabela from '@/components/ui/tabela';
import { useExtraction } from '@/context/ExtractionContext';
import { FIELD_KEYS, AVAILABLE_FIELDS } from '@/constants/fields';


const ProcessPage: FC = () => {

    // Pega diretamente o array de resultados da extração
    const { processedResults } = useExtraction();
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
    
    // Safety check
    if (totalProcessedCount === 0) {

        // Se a navegação pra cá falhou, não tem resultado, volta pra home
        navigate('/');
        return null;
    }

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

    // Verifica se a tabela está vazia
    // const isTableEmpty = tableStatusData.length === 0;
    
    return (
        <VStack w="100%" h="100%" align="center" justify="start" gap="10px">

            <Header title="CNPJ Scan" />

            <Box flexGrow={1} p={8} w="100%" textAlign="center">
                
                <Heading size="3xl" mb={8}>
                    Processamento Concluído
                </Heading>

                {/* INJEÇÃO 1: Tabela de status */}
                <Flex align="center" justify="center" mb={8}>
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

                {/* Botão para o Próximo Passo */}
                <Button
                    mt={10}
                    size="lg"
                    onClick={handleNextStep}
                    disabled={validFilesForReport.length === 0}
                    // isDisabled={validFilesForReport.length === 0}
                    // Adicione isLoading, etc. se necessário
                >
                    Gerar Tabela CSV
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