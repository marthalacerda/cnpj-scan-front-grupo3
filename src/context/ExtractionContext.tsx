import { createContext, useState, useContext, FC, ReactNode, useCallback } from 'react';
import { ExtractBatchResponse, SingleFileResult } from '@/api/cnpj';


// Interface do estado é uma lista de resultados da extração
export type GlobalResultsState = SingleFileResult[];

// 1. Define o formato do Contexto
interface ExtractionContextType {
    
    // O estado é uma lista de resultados ou uma lista vazia
    processedResults: GlobalResultsState;

    // Salvar o lote de resultados
    setProcessedResults: (results: GlobalResultsState) => void;

    // Função para adicionar arquivos (HomePage)
    addFile: (file: File) => void;

    // Lista temporária de arquivos antes do processamento (LoadingPage)
    uploadedFilesTemp: File[];

    // Função para limpar a fila temporária (após o processamento)
    clearUploadedFilesTemp: () => void;

    resetBatch: () => void;
}

// 2. Cria o Contexto (valor padrão)
const ExtractionContext = createContext<ExtractionContextType | undefined>(undefined);

// 3. Cria o Provedor do Contexto (Provider)
interface ExtractionProviderProps {
    children: ReactNode;
}

export const ExtractionProvider: FC<ExtractionProviderProps> = ({ children }) => {

    // Armazena o resultado final do lote (uso para ProcessPage/ReportPage)
    const [processedResults, setProcessedResults] = useState<GlobalResultsState>([]);

    // Armazena os objetos File antes de ir pra API
    const [uploadedFilesTemp, setUploadedFilesTemp] = useState<File[]>([]);

    // Função para limpar a fila (usada após o processamento)
    const clearUploadedFilesTemp = useCallback(() => {
        setUploadedFilesTemp([]);
    }, []);

    // Função para adicionar arquivos (limpa o estado anterior de resultado)
    const addFile = useCallback((file: File) => {
        // Zera o resultado anterior quando um novo lote começa a ser upado
        setProcessedResults([]);
        setUploadedFilesTemp([file]);
    }, []);

    const resetBatch = useCallback(() => {
        setProcessedResults([]);
        setUploadedFilesTemp([]);
    }, []);

    // Função para salvar o resultado final do backend - os dados extraídos
    const setBatchResults = useCallback((results: ExtractBatchResponse) => {
        setProcessedResults(results); // Salva o resultado final
    }, []);

    const addNewFileToTemp = useCallback((file: File) => {
        setUploadedFilesTemp(prev => [...prev, file]);
    }, []);

    const contextValue = {
        processedResults,
        setProcessedResults: setBatchResults,
        uploadedFilesTemp,
        addFile: addNewFileToTemp,
        clearUploadedFilesTemp,
        resetBatch
    };

    return (

        // Passamos a função de salvar lote
        <ExtractionContext.Provider value={contextValue}>
            {children}
        </ExtractionContext.Provider>
    );
};    


// 4. Cria o hook customizado para usar o contexto facilmente
export const useExtraction = ()  => {

    const context = useContext(ExtractionContext);
    
    if (context == undefined) {

        throw new Error('useExtraction deve ser usado dentro de um ExtractionProvider');
    
    }
    
    return context;
};
