import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ExtractResponse } from '@/api/cnpj';


// Estado inicial do arquivo upado (antes da extração dos dados)
interface UploadedFile {
    id: string; // para identificar o arquivo
    name: string;
    fileObject: File; // o objeto real do arquivo, p usar depois
    isProcessed: boolean;
    result?: ExtractResponse; // preenchido apos a extração
}

// 1. Define o formato do Contexto
interface ExtractionContextType {
    uploadedFiles: UploadedFile[];
    addFile: (file: File) => void;
    updateFileResult: (id: string, result: ExtractResponse) => void;
    // extractionResult: ExtractResponse | null;
    // setExtractionResult: (result: ExtractResponse | null) => void;
}

// 2. Cria o Contexto (valor padrão)
const ExtractionContext = createContext<ExtractionContextType | undefined>(undefined);

// 3. Cria o Provedor do Contexto (Provider)
interface ExtractionProviderProps {
    children: ReactNode;
}

export const ExtractionProvider: React.FC<ExtractionProviderProps> = ({ children }) => {

    // Armazena o resultado em um estado
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

    const addFile = (file: File) => {
        const newFile: UploadedFile = {
            id: Date.now().toString(), // id simples e unico
            name: file.name,
            fileObject: file,
            isProcessed: false,
        };
        setUploadedFiles(prev => [...prev, newFile]);
    };

    const updateFileResult = (id: string, result: ExtractResponse) => {
        setUploadedFiles(prev => prev.map(f =>
            f.id === id ? { ...f, isProcessed: true, result: result } : f
        ));
    };

    return (
        <ExtractionContext.Provider value={{ uploadedFiles, addFile, updateFileResult }}>
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
