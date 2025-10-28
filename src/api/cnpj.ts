const API_BASE_PATH: string = import.meta.env.VITE_API_BASE_PATH || '/api';
const UPLOAD_ENDPOINT = `${API_BASE_PATH}/upload_filename/`;
const EXTRACT_DATA_ENDPOINT = `${API_BASE_PATH}/extract_data/`;


// ----------------------------------------------------
// 1. DEFINIÇÃO DE TIPOS (TypeScript)
// ----------------------------------------------------

// Definição dos tipos de dados que vêm do backend
export interface ExtractedData {
    numero_de_inscricao?: string;
    data_de_abertura?: string;
    nome_empresarial?: string;
    nome_de_fantasia?: string;
    porte?: string;
    atividade_principal?: string;
    atividades_secundarias?: string;
    natureza_juridica?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    cep?: string;
    bairro?: string;
    municipio?: string;
    uf?: string;
    email?: string;
    telefone?: string;
    efr?: string;
    situacao_cadastral?: string;
    data_situacao_cadastral?: string;
    motivo_situacao_cadastral?: string;
    situacao_especial?: string;
    data_situacao_especial?: string;    
}

// Objeto que o backend retorna para cada arquivo
export interface SingleFileResult {
    filename: string;
    status: string;
    extracted_data?: ExtractedData;
    error?: boolean;    // alterado para boolean em múltiplos
}

// O backend retorna uma lista desses objetos
export type ExtractBatchResponse = SingleFileResult[];

// O objeto de retorno do nosso hook (contém a lista de resultados)
export interface BatchApiResponse {
    success: boolean;
    message: string;
    data?: ExtractBatchResponse;
}

// ----------------------------------------------------
// 2. FUNÇÃO DE REQUISIÇÃO - LOTE DE ARQUIVOS
// ----------------------------------------------------

export async function extractBatchDataFromPDFs(files: File[]): Promise<BatchApiResponse> {
    // console.log(`Tentando EXTRAIR dados de ${files.length} arquivos via POST para: ${EXTRACT_DATA_ENDPOINT}`);
    const formData = new FormData();

    // Adicionar todos os arquivos no FormData
    // 'files' vai ser o parâmetro 'files: List[UploadFile] = File(...)' do back
    files.forEach(file => {
        formData.append('files', file);
    });

    try {
        const response = await fetch(EXTRACT_DATA_ENDPOINT, {
            method: 'POST',
            body: formData
        });

        // Tratamento de erro http (4xx ou 5xx)
        if (!response.ok) {
            const errorData = await response.json();
            const detail = errorData.detail || `Status: ${response.status}`;
            throw new Error(`${detail}`);
        }

        // Tratamento de sucesso (200 ok) - Espera-se uma lista de resultados
        const data: ExtractBatchResponse = await response.json();

        return {
            success: true,
            //message: data.status || "Extração concluída com sucesso.",
            message: `Processamento de ${data.length} arquivos concluídos`,
            data: data
        };

    } catch (error) {
        let message = "Falha de conexão ou rede.";
        if (error instanceof Error) {
            message = error.message;
        }

        return {
            success: false,
            message: message,
        };
    }
}



/**
 * Envia o objeto File para o backend usando FormData.
 * @param file O objeto File real selecionado pelo usuário.
 * @returns Um objeto com o status da requisição e o nome do arquivo retornado.
 */
export async function uploadFileToBackend(file: File): Promise<{ success: boolean; message: string; data?: any }> {

    console.log(`Tentando UPLOAD POST para: ${UPLOAD_ENDPOINT} com arquivo: ${file.name}`);

    // Cria o objeto FormData
    const formData = new FormData();
    // ⚠️ 'file' aqui deve CORRESPONDER ao nome do parâmetro no FastAPI (file: UploadFile = File(...))
    formData.append('file', file); 
    console.log(formData)
    
    try {
        const response = await fetch(UPLOAD_ENDPOINT, {
            method: 'POST',
            // O Content-Type é automaticamente definido como multipart/form-data
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro do Backend: ${response.status} - ${errorText.substring(0, 50)}...`);
        }

        const data = await response.json(); 

        return {
            success: true,
            // Assume que o backend retorna um JSON com o campo 'filename'
            message: `Upload OK! Backend retornou o nome: ${data.filename}`, 
            data: data
        };

    } catch (error) {
        let message = 'Falha de conexão ou rede.';
        if (error instanceof Error) {
            message = `Erro na Conexão: ${error.message}`;
        }

        return {
            success: false,
            message: message,
        };
    }
}