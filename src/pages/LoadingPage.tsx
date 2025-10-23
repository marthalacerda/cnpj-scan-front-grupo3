import { Spinner, Heading, VStack, Text } from '@chakra-ui/react';
import { useEffect, FC } from 'react';
import { useNavigate } from 'react-router-dom'; // Pega o ID da URL
import { useExtraction } from '@/context/ExtractionContext';
import { extractBatchDataFromPDFs } from '@/api/cnpj'; // A função de extração
// import { getCsvReport } from '@/api/reports';

const LoadingPage: FC = () => {

    // Pega a fila temporária e as funções de manipulação do estado global
    const { setProcessedResults, uploadedFilesTemp, clearUploadedFilesTemp } = useExtraction();

    const navigate = useNavigate();

    // Lógica para saber quantos arquivos estão na fila
    const filesToProcessCount = uploadedFilesTemp.length;
    
    useEffect(() => {

        // Safety check: Se, por algum motivo, a lista de arquivos a processar estiver vazia aqui, saia.
        if (filesToProcessCount === 0) {
            navigate('/');
            return;
        }

        const runExtraction = async () => {

            const fileObjects = uploadedFilesTemp;

            try {
                // Chamada única para o backend
                const result = await extractBatchDataFromPDFs(fileObjects);
            
            if (result.success && result.data) {
                // Salva a lista bruta de resultados
                setProcessedResults(result.data); 
            } else {
                // Trata as falhas na API: cria um resultado de erro para todos os arquivos
                const errorResult = fileObjects.map(f => ({
                    filename: f.name,
                    status: result.message,
                    error: true
                }));
                setProcessedResults(errorResult);
            }
            
            // Limpa a fila TEMP e navega para a Page (Resultado/Status)
            clearUploadedFilesTemp();
            navigate(`/resultado`);
            
            } catch (error) {
                console.error("Erro fatal na extração:", error);
                // Em caso de erro total, ainda navegamos para mostrar o erro
                navigate(`/resultado`);
            }
        };

        runExtraction();

    }, [filesToProcessCount, navigate, setProcessedResults, clearUploadedFilesTemp]);

    
    // UI de Loading
    return (
        <VStack w="100%" h="100%" align="center" justify="center">
            <Spinner size="xl" color="white" />
            <Heading size="xl">Processando dados dos ({filesToProcessCount}) arquivos...</Heading>
            
            <Text fontSize="lg">
                Aguarde, análise/extração em andamento.
            </Text>
        </VStack>
    );
};

export default LoadingPage;