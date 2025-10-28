import { Box, Button, Heading, VStack, Flex, IconButton, Text } from '@chakra-ui/react';
import { FC, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/ui/header'; 
import Footer from '@/components/ui/Footer';
import { useExtraction } from '@/context/ExtractionContext';
import { IoCloseCircleOutline } from 'react-icons/io5';
import Txtespec from '@/components/ui/TextDescriptions';

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

    const isEmpty = fileListData.length === 0;

    // // Safety check
    // useEffect(() => {

    //     if (isEmpty) {
    //         navigate('/');
    //     }
        
    // }, [isEmpty, navigate]);

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
        navigate(`/extracao`);
    };

    const handleRemoveFile = (indexToRemove: number) => {
        removeFile(indexToRemove);
    };

    return (
        <VStack w="100%" minH="100vh" align="stretch"> 
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


            <Box flexGrow={1} paddingY={4} paddingX={8} w="100%" 
                textAlign="center"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="flex-start" // Alinha o conteúdo ao topo
                overflowY="auto" // Scroll vertical aqui
            >
                {/* <Heading size="xl" mb={6}> */}
                    {/* {isEmpty ? 'Nenhum arquivo carregado' : `${fileListData.length} arquivo(s)` } */}
                {/* </Heading> */}
                <Heading size="xl" mb={6}>
                    {`${fileListData.length} arquivo(s) anexados` }
                </Heading>

                {/* Renderização condicional */}
                {isEmpty ? (
                    <VStack minH="300px" justify="center">
                        {/* Botão principal para iniciar o upload */}
                        <Button 
                            bg= "white"
                            color= "#036DC5"
                            _hover={{ bg: "#bed8f1ff" }}
                            size="lg"
                            rounded="md"
                            boxShadow="md"
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
                            maxHeight="300px" // ALTURA MÁXIMA PARA CONTROLAR O SCROLL
                            overflowY="auto"  // ATIVA O SCROLL VERTICAL
                            p={2} 
                            borderRadius="md" 
                            bg="white"    
                        >
                                                        
                            <VStack align="start" w="full"> {/* Removidos p e bg repetidos */}
                                
                                {uploadedFilesTemp.map((file, index) => (
                                    <Flex key={index} justify="space-between" align="center" w="full" p={1} bg="rgba(119, 119, 119, 0.03)" borderRadius="sm">
                                        <Text
                                            maxW="85%"
                                            fontSize={14} 
                                            color="#036DC5" 
                                            textAlign="left"
                                            flexGrow={1}
                                            paddingLeft={3}
                                            whiteSpace="nowrap"
                                            truncate
                                        >
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
                            {/* Botão para adicionar mais, sem navegar */}
                            <Button 
                                bg= "white"
                                color= "#036DC5"
                                _hover={{ bg: "#bed8f1ff" }}
                                size="lg"
                                rounded="md"
                                boxShadow="md"
                                onClick={handleAddMoreClick}
                            >
                                + Adicionar mais arquivos
                            </Button>

                            <Button
                                bg= "white"
                                color= "#036DC5"
                                _hover={{ bg: "#bed8f1ff" }}
                                size="lg"
                                rounded="md"
                                boxShadow="md"
                                onClick={handleExtractAll}
                            >
                                Avançar &rarr;
                            </Button>
                            
                        </Flex>
                    </>
                )}
                
                <Txtespec/>
            </Box>


            <Footer title="CNPJ Scan" copyrightText="Grupo 3 NEXT" />
        </VStack>
    );
};

export default FileListPage;

