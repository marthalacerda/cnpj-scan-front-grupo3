import { Spinner, Heading, VStack, Text, Center, Box } from '@chakra-ui/react';
import { useEffect, FC, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Pega o ID da URL
import { GlobalResultsState, useExtraction } from '@/context/ExtractionContext';
import { extractBatchDataFromPDFs } from '@/api/cnpj'; // A função de extração
import Header from '@/components/ui/header';
import Txtespec from '@/components/ui/TextDescriptions';
import Footer from '@/components/ui/Footer';
import { motion } from 'framer-motion'
// import { getCsvReport } from '@/api/reports';

const MotionText = motion(Text);

const LoadingPage: FC = () => {

    // Pega a fila temporária e as funções de manipulação do estado global
    const { processedResults, setProcessedResults, uploadedFilesTemp, clearUploadedFilesTemp } = useExtraction();

    const navigate = useNavigate();

    // Lógica para saber quantos arquivos estão na fila
    const filesToProcessCount = uploadedFilesTemp.length;

    // Controla se o fetch está em execução
    const [isFetchRunning, setIsFetchRunning] = useState(false);
    
    useEffect(() => {

        // Safety check: Se, por algum motivo, a lista de arquivos a processar estiver vazia aqui, saia.
        if (filesToProcessCount === 0) {
            // navigate('/');
            return;
        }

        // Se o fetch já foi iniciado, sair
        if (isFetchRunning) return;

        setIsFetchRunning(true);

        const runExtraction = async () => {

            const fileObjects = uploadedFilesTemp;

           
            try {
                // Chamada única para o backend
                const result = await extractBatchDataFromPDFs(fileObjects);
                console.log("3. [LOG DE RESPOSTA] Resposta recebida da API de extração:", result);
            
                if (result.success && result.data) {
                // Salva a lista bruta de resultados
                    setProcessedResults(result.data); 
                } else {
                    // Trata as falhas na API: cria um resultado de erro para todos os arquivos
                    const errorResult = fileObjects.map(f => ({
                        filename: f.name,
                        // status: result.message,
                        status: "Erro de Rede/Servidor",
                        error: true
                    }));
                setProcessedResults(errorResult);
                } 
            
            
            } catch (error) {
                console.error("Erro fatal na extração:", error);
                // Em caso de erro total, ainda navegamos para mostrar o erro
                    const errorResult2 = fileObjects.map(f => ({
                        filename : f.name,
                        status: 'Erro de rede/servidor',
                        error: true
                    }));
                    // navigate(`/resultado`);
            }
            // console.log(processedResults)   // aqui tá mostrando quantos results tem
            // console.log(processedResults.length) // aqui tá mostrando zero
            
            navigate(`/resultado`);
            
            // Limpa a fila TEMP e navega para a Page (Resultado/Status)
            clearUploadedFilesTemp();

        };

        runExtraction();

    }, [filesToProcessCount, navigate, setProcessedResults, clearUploadedFilesTemp, isFetchRunning]);

    
    // UI de Loading
    return (

    //  Contêiner Principal: Deve ser um Flexbox (VStack/Flex) com altura total.
  
        <VStack w="100%" minHeight="100vh" align="center">

            {/* Header */}
	        <Header title="CNPJ Scan" />

           	{/* Conteúdo Principal: Ocupa o espaço restante e centraliza horizontalmente e verticalmente. */}
            <Center 
			    flexGrow={1} 
			    p={8}
			    w="100%"

                flexDirection="column"
	        
            >
                {/* Box de Conteúdo: Centralizada pela 'Center' acima. Limita a largura do conteúdo. */}
                <Box
                    w={{ base: "90%", md: "60%" }}
                    textAlign="center"
                >
                    <Heading
                        size="3xl"
                        mb={2}
                        whiteSpace={{ base: "normal", md: "nowrap"}}
                    >
                        Converta PDF para EXCEL.
                    </Heading>

                    <Text
                        fontSize="lg"
                        color="white"
                        mb={8}
                    >
                        Powered by Cesar School
                    </Text>
                </Box>
            </Center>

                
            <Box 
                flexGrow={8} 
                p={8} 
                w="100%"
                textAlign="center"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="flex-start"
                mt={-20} 
        
            >
                {/* Spinner and MotionText */}
                <Spinner size="lg" color="white"/>

                <MotionText
                    mt={4}
                    fontSize="lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
                >
                    Estamos trabalhando...
                </MotionText>

                <MotionText
                    mt={4}
                    fontSize="lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
                >
                    Processando dados de ({filesToProcessCount}) arquivos...
                </MotionText>
            

                {/* Retângulo branco abaixo da mensagem de carregamento */}
                {/* <Box
                    mt={10} // margem superior para afastar da mensagem
                    w={{ base: "90%", md: "60%", lg: "40%" }} // largura responsiva
                    h="150px" // altura fixa, você pode ajustar
                    bg="whiteAlpha.900"
                    borderRadius="2xl"
                    boxShadow="none"
                    overflowY="auto"
                    p={4}
                    />
                    */}
            
            </Box>
    
            {/* Adicionando o componente Txtespec abaixo do retângulo branco */}
            <Box mt={8} w="100%" px={{ base: 4, md: 8 }}>
                <Txtespec /> {/* Aqui você adiciona os textos informativos */}
            </Box>
			
            
	  
            {/* Footer: Deve ser o ÚLTIMO elemento e tem o 'mt="auto"' interno. */}
            <Footer 
                title="CNPJ Scan" 
                copyrightText="Grupo 3 NEXT"
            />

            {/* <Spinner size="xl" color="white" />
            <Heading size="xl">Processando dados dos ({filesToProcessCount}) arquivos...</Heading>
            
            <Text fontSize="lg">
                Aguarde, análise/extração em andamento.
            </Text> */}
        </VStack>
    );
};

export default LoadingPage;