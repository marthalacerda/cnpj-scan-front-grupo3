import { Box, Button, Heading, VStack, Flex, IconButton, Text } from '@chakra-ui/react';
import { FC, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/ui/Header'; 
import Footer from '@/components/ui/Footer';
import Tabela from '@/components/ui/Tabela';
import { useExtraction } from '@/context/ExtractionContext';
import { IoCloseCircleOutline } from 'react-icons/io5';

const FileListPage: FC = () => {

    // Usa a lista temporária que tem os objetos File
    const { uploadedFilesTemp, removeFile, addFile } = useExtraction();
    const navigate = useNavigate();

    // Referência para input de arquivo
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Cria o dataset para a tabela: apenas o nome e id
    const fileListData = useMemo(() => {
        return uploadedFilesTemp.map((file, index) => ({
            id: index,
            name: file.name,
            status: "Carregado", // status e hasError não vão aparecer - precisa para não dar erro
            hasError: false,
        }));
    }, [uploadedFilesTemp]);

    // Lógica para abrir o input de arquivo (borão de add + arquivos)
    const handleAddMoreClick = () => {
        fileInputRef.current?.click();
    };

    // Lógica para adicionar arquivos
    const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            // Add cada arquivo a fila
            Array.from(files).forEach(file => addFile(file));
        }
        event.target.value = ''; // Limpa o input
    };

    // Ação do Botão: Navega para a LoadingPage
    const handleExtractAll = () => {
        navigate(`/status/todos`);
    };

    const handleRemoveFile = (indexToRemove: number) => {
        removeFile(indexToRemove);
    };

    // // Safety check
    // if (fileListData.length === 0) {
    //     navigate('/');
    //     return null;
    // }

    const isEmpty = fileListData.length === 0;
    

    return (
        <VStack w="100%" h="100%" align="center" justify="start" gap="10px"> 
            <Header title="CNPJ Scan" />

            {/* Input de arquivo */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelection}
                style={{ display: 'none' }}
                accept=".pdf"
                multiple
            />


            <Box flexGrow={1} p={8} w="100%" textAlign="center">
                <Heading size="2xl" mb={6}>
                    {isEmpty ? "..." : `${fileListData.length} arquivo(s) carregado(s)` }
                    {/* {uploadedFilesTemp.length} arquivo(s) carregado(s): */}
                </Heading>

                {/* Renderização condicional */}
                {isEmpty ? (
                    <VStack minH="300px" justify="center">
                        <Text fontSize="xl" color="whiteAlpha.800">
                            Nenhum arquivo carregado ainda.
                        </Text>
                        {/* Botão principal para iniciar o upload */}
                        <Button 
                            size="lg" 
                            colorScheme="blue" 
                            onClick={handleAddMoreClick}
                        >
                            Carregar Arquivos PDF
                        </Button>
                    </VStack>
                ) : (
                    // ----------------------------------------------------
                    // MODO DE VISUALIZAÇÃO DE ARQUIVOS
                    // ----------------------------------------------------
                    <>
                        {/* Lista com botão de remoção */}
                        <Box 
                            mb={10} 
                            mx="auto" 
                            maxW="800px" 
                            w="full"
                            maxHeight="400px" // ALTURA MÁXIMA PARA CONTROLAR O SCROLL
                            overflowY="auto"  // ATIVA O SCROLL VERTICAL
                            p={2} 
                            borderRadius="md" 
                            bg="rgba(255, 255, 255, 0.1)"    
                        >
                                                        
                            <VStack align="start" w="full" > {/* Removidos p e bg repetidos */}
                                
                                {uploadedFilesTemp.map((file, index) => (
                                    <Flex key={index} justify="space-between" align="center" w="full" p={1} bg="rgba(0,0,0,0.1)" borderRadius="sm">
                                        <Text color="white" 
                                            textAlign="justify"
                                            flexGrow={1}
                                            paddingLeft={5}>
                                            {file.name}
                                        </Text>
                                        <IconButton
                                            aria-label={`Remover ${file.name}`}
                                            size="sm"
                                            variant="ghost"
                                            colorScheme="red"
                                            onClick={() => handleRemoveFile(index)}
                                            mr={3}
                                        >
                                            <IoCloseCircleOutline />
                                        </IconButton>
                                    </Flex>
                                ))}
                            </VStack>
                        </Box>

                        {/* BOTÕES DE AÇÃO: EXTRAIR ou ADICIONAR MAIS */}
                        <Flex gap={4} justify="center">
                            <Button
                                size="lg"
                                colorScheme="green"
                                onClick={handleExtractAll}
                            >
                                Analisar {fileListData.length} Arquivo(s)
                            </Button>
                            
                            {/* Botão para adicionar mais, sem navegar */}
                            <Button size="lg" variant="outline" colorScheme="blue" onClick={handleAddMoreClick}>
                                + Adicionar Mais
                            </Button>
                        </Flex>
                    </>
                )}
            </Box>

            <Footer title="CNPJ Scan" copyrightText="Grupo 3 NEXT" />
        </VStack>
    );
};

export default FileListPage;

