import { createContext, useState, useContext, FC, ReactNode, useCallback } from 'react';
import { ExtractBatchResponse, SingleFileResult } from '@/api/cnpj';


// Interface de tipagem - o que o backend retorna (lista de SingleFileResult)
export type GlobalResultsState = SingleFileResult[];


// 1. Define o formato do Contexto
interface ExtractionContextType {
    processedResults: GlobalResultsState;
    setProcessedResults: (results: GlobalResultsState) => void;
    uploadedFilesTemp: File[];
    addFile: (file: File) => void;
    clearUploadedFilesTemp: () => void;
    resetBatch: () => void;
    removeFile: (indexToRemove: number) => void;
    isBatchComplete: boolean;
}


// 2. Cria o Contexto
const ExtractionContext = createContext<ExtractionContextType | undefined>(undefined);


// 3. Define o Provedor do Contexto
interface ExtractionProviderProps {
    children: ReactNode;
}


// 4. Cria o Provedor do Contexto
export const ExtractionProvider: FC<ExtractionProviderProps> = ({ children }) => {

    // Armazena o resultado final dos arquivos processados
    const [processedResults, setProcessedResults] = useState<GlobalResultsState>([]);

    // Armazena os objetos File antes de ir pra API
    const [uploadedFilesTemp, setUploadedFilesTemp] = useState<File[]>([]);

    // Indica se o processamento terminou
    const [isBatchComplete, setIsBatchComplete] = useState(false);

    // Função para salvar o resultado final do backend - os dados extraídos
    const setBatchResults = useCallback((results: ExtractBatchResponse) => {
        setProcessedResults(results);
        setIsBatchComplete(true);
    }, []);

    // Função para limpar a fila (usada após o processamento)
    const clearUploadedFilesTemp = useCallback(() => {
        setUploadedFilesTemp([]);
    }, []);
    
    // Função para adicionar arquivos a fila
    const addFile = useCallback((file: File) => {
        // Zera o resultado anterior quando um novo lote começa a ser upado
        if (uploadedFilesTemp.length === 0) {
            setProcessedResults([]);
        }
        setUploadedFilesTemp(prev => [...prev, file]);
    }, [uploadedFilesTemp]);

    const resetBatch = useCallback(() => {
        setProcessedResults([]);
        setUploadedFilesTemp([]);
        setIsBatchComplete(false);
    }, []);

    // Função para remover arquivo pelo índice
    const removeFile = useCallback((indexToRemove: number) => {
        setUploadedFilesTemp(prev =>
            prev.filter((_, index) => index !== indexToRemove)
        );
    }, [])
   

    const contextValue = {
        processedResults,
        setProcessedResults: setBatchResults,
        uploadedFilesTemp,
        addFile,
        clearUploadedFilesTemp,
        resetBatch,
        removeFile,
        isBatchComplete
    };

    return (
        <ExtractionContext.Provider value={contextValue}>
            {children}
        </ExtractionContext.Provider>
    );
};    


// 5. Cria o hook customizado para usar o contexto facilmente
export const useExtraction = ()  => {

    const context = useContext(ExtractionContext);
    
    if (context == undefined) {

        throw new Error('useExtraction deve ser usado dentro de um ExtractionProvider');
    
    }
    
    return context;
};
