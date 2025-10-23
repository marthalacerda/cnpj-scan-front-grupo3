import { 
    Box, 
    Button, 
    Heading, 
    Text, 
    VStack,
    SimpleGrid,  // NOVO: Para layout de checkboxes
    Checkbox    // NOVO: Para seleção de campos
} from '@chakra-ui/react';
import { Table, Tbody, Thead, Tr, Th, Td } from '@chakra-ui/table';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header'; 
import Footer from '../components/ui/Footer';
import { useExtraction } from '@/context/ExtractionContext';
import { downloadCsvReport, getCsvReport } from '@/api/reports'; // NOVO: Funções de API de relatório
import { AVAILABLE_FIELDS, FIELD_KEYS } from '@/constants/fields'; // NOVO: Constantes de campos

const ResultPage: React.FC = () => {
    const { uploadedFiles } = useExtraction();
    const navigate = useNavigate();

    // Estado local para armazenar os campos selecionados
    const [selectedFields, setSelectedFields] = React.useState<string[]>([]);

    // Filtra os arquivos processados e que possuem resultados
    const processedFiles = uploadedFiles.filter(f => f.isProcessed && f.result);

    // Filtra arquivos que têm dados válidos para o relatório
    const validFilesForReport = processedFiles.filter(f => !f.result?.error);

    // Lógica de redirecionamento
    if (uploadedFiles.length === 0) {
        navigate('/');
        return null;
    }

    // Verifica se algum arquivo falhou
    const hasAnyError = processedFiles.some(f => f.result?.error);

    // Função para lidar com a seleção de checkboxes
    const handleFieldChange = (fieldKey: string, isChecked: boolean) => {
        setSelectedFields(prev => isChecked ? [...prev, fieldKey] : prev.filter(f => f !== fieldKey));
    };

    const handleNextStep = () => {
        let fieldsToSend: string[] = selectedFields;

        // Se a lista de campos estiver vazia, todos os campos vão ser usados
        if (selectedFields.length === 0) {
            fieldsToSend = FIELD_KEYS
        }

        // Navega para a página de relatório, passando os campos
        navigate('/relatorio', { state: { selectedFields: fieldsToSend } });
    };

    return (
        <VStack w="100%" h="100%" align="center" justify="start" gap="10px"> 
            <Header title="CNPJ Scan" />

            <Box flexGrow={1} p={8} w="100%" textAlign="center">
                
                <Heading size="xl" mb={8}>
                    Relatório de Processamento
                </Heading>

                {/* --- Tabela de Status (Iterando sobre TODOS) --- */}
                <Box 
                    maxW="1000px" 
                    mx="auto" 
                    p={4} 
                    bg="rgba(0,0,0,0.2)" 
                    borderRadius="lg"
                    overflowX="auto"
                >
                    <Table variant="simple" colorScheme="whiteAlpha">
                        <Thead>
                            <Tr>
                                <Th color="white">Nome do Arquivo</Th>
                                <Th color="white">Status (Backend)</Th>
                            </Tr>
                        </Thead>
                        <Tbody> 
                            {processedFiles.map((file) => {
                                const statusMessage = file.result!.status; 
                                const hasError = file.result!.error; 
                                const rowColor = hasError ? 'red.400' : 'green.400';

                                return (
                                    <Tr key={file.id}>
                                        <Td fontWeight="bold" color="white" textAlign="start">
                                            {file.name}
                                        </Td>
                                        <Td color={rowColor} fontWeight="bold">
                                            {statusMessage}
                                        </Td>
                                    </Tr>
                                );
                            })}
                        </Tbody>
                    </Table>
                </Box>
                
                {/* --- SEÇÃO DE SELEÇÃO DE CAMPOS --- */}
                {/* Mostra a seleção apenas se houver pelo menos 1 arquivo processado sem erro */}
                {!hasAnyError && processedFiles.length > 0 && (
                    <Box mt={10} maxW="1000px" mx="auto" p={6} bg="rgba(0,0,0,0.3)" borderRadius="lg">
                        <Heading size="md" mb={4}>
                            3. Selecione os Campos para o Relatório CSV 
                            {/* ⚠️ INFORMAÇÃO IMPORTANTE PARA O USUÁRIO */}
                            <Text as="span" fontSize="sm" ml={2} color="yellow.300">
                                (Se nenhum for selecionado, todos os campos serão incluídos)
                            </Text>
                        </Heading>
                        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} textAlign="left">
                            {FIELD_KEYS.map(key => (
                                <Checkbox 
                                    key={key}
                                    colorScheme="green"
                                    isChecked={selectedFields.includes(key)}
                                    onChange={(e) => handleFieldChange(key, e.target.checked)}
                                >
                                    {AVAILABLE_FIELDS[key as keyof typeof AVAILABLE_FIELDS]}
                                </Checkbox>
                            ))}
                        </SimpleGrid>
                    </Box>
                )}

                {/* --- BOTÃO DE PRÓXIMO PASSO --- */}
                <Button
                    mt={10}
                    size="lg"
                    colorScheme="green"
                    onClick={handleNextStep}
                    isDisabled={hasAnyError || processedFiles.length === 0}
                >
                    Gerar Relatório e Visualizar Tabela
                </Button>
                
            </Box>

            <Footer title="CNPJ Scan" copyrightText="Grupo 3 NEXT" />
        </VStack>
    );
};
export default ResultPage;
