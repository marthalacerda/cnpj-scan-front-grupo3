import { ExtractedData } from "./cnpj";
import { SingleFileResult } from "./cnpj";

const API_BASE_PATH: string = import.meta.env.VITE_API_BASE_PATH || '/api';
const GET_CSV_ENDPOINT = `${API_BASE_PATH}/get_csv/`;
// const DOWNLOAD_CSV_ENDPOINT = `${API_BASE_PATH}/download_csv/`;

/**
 * Prepara o payload para enviar ao backend.
 * O backend espera uma LISTA de objetos = [{"extracted_data": {..}}, {..}, ..] 
 * @param results Lista de SingleFileResult (contendo filename, status, etc.)
 */
function prepareReportPayload(allResults: SingleFileResult[]) {
    
    // Filtrar apenas os resultados que não tem erro e tem extracted_data
    const validResults = allResults.filter(r => !r.error && r.extracted_data);

    // Mapeia para o formato JSON que o backend espera
    return validResults.map(result => ({
        "extracted_data": result.extracted_data
    }));
}

/**
 * Chama o backend para gerar o CSV, retornando a string CSV
 * @param allResults lista de todos os resultados do processamento
 * @param fields lista de chaves dos campos a serem incluídos
*/
export async function getCsvReport(
    allResults: SingleFileResult[],
    fields: string[]
): Promise<{ success: boolean; data?: string; message: string }> {

    const payload = prepareReportPayload(allResults);

    if (payload.length === 0) {
        return { success: false, message: "Nenhum arquivo válido para gerar o relatório", data: "" };
    }

    const url = new URL(GET_CSV_ENDPOINT);
    if (fields && fields.length > 0) {
        fields.forEach(field => {
            url.searchParams.append('fields', field);
        });
    }

    const targetUrl = url.toString();

    try {
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json(); // se o back retornar json de erro
            throw new Error(errorData.detail || `Erro HTTP: ${response.status}`);
        }

        // O back retorna um texto/csv
        const csvContent = await response.text();

        return { success: true, data: csvContent, message: "CSV gerado com sucesso." };

    } catch (error) {
        return { success: false, message: `Falha ao visualizar CSV: ${error instanceof Error ? error.message : String(error)}` };
    }

}
