import { Table } from "@chakra-ui/react"
import { FC, useMemo } from "react"

// Definição da interface de dados
interface StatusData {
  id: number;
  name: string;
  status: string;
  hasError: boolean; // para decidir a cor
}

interface FileListingData {
  id: number;
  name: string;
}

// Interface para as Props
interface TabelaProps {
  data: StatusData[] | FileListingData[];
  isSimpleList?: boolean;
}


const MAX_TABLE_HEIGHT = "600px";
const MIN_TABLE_HEIGHT = "100px";
const ROW_HEIGHT_ESTIMATE = 50;



// A tabela recebe dados do componente pai
const Tabela: FC<TabelaProps> = ({ data, isSimpleList=false }) => {

  // Helper para formatar o status na célula se não for lista simples
  const getStatusColor = (hasError: boolean) => hasError ? '#E53E3E' : '#38A169'; // Vermelho ou Verde
  const getStatusText = (hasError: boolean) => hasError ? 'Erro' : 'Sucesso';
  
  const calculatedHeight = useMemo(() => {
    // cabeçalho + altura de todas as linhas
    const contentHeight = (1 + data.length) * ROW_HEIGHT_ESTIMATE;

    // Se a altura calculada for menor que o MÁXIMO, usamos a altura calculada
        // Caso contrário, usamos a altura MÁXIMA para forçar a rolagem.
        if (contentHeight <= parseFloat(MAX_TABLE_HEIGHT)) {
            // Se a altura calculada for muito pequena, garantimos a altura mínima
            return `${Math.max(contentHeight, parseFloat(MIN_TABLE_HEIGHT))}px`;
        }
        
        // Se exceder o limite, retorna a altura máxima
        return MAX_TABLE_HEIGHT;

  }, [data.length]);

  return (
    <Table.ScrollArea
      borderWidth="0.5px"
      borderColor="white"
      rounded="md"
      height={calculatedHeight}
      width="600px"
    >
      <Table.Root size="md" stickyHeader>
        <Table.Header fontSize="120%">
          <Table.Row bg="gray.300">
            {/* ⚠️ LÓGICA DE CABEÇALHO CONDICIONAL */}
            <Table.ColumnHeader color="#036DC5" width="20%"></Table.ColumnHeader>
            <Table.ColumnHeader color="#036DC5" width={isSimpleList ? "80%" : "40%"}>Arquivo</Table.ColumnHeader>
            {!isSimpleList && (
              <Table.ColumnHeader color="#036DC5" width="40%">Status</Table.ColumnHeader>
            )}
          </Table.Row>
        </Table.Header>

        <Table.Body color="white">
          {data.map((item) => (
            <Table.Row key={item.id} bg="white" borderColor="white">
              
              {/* Coluna ID */}
              <Table.Cell color="#036DC5" fontWeight="bold">{item.id} </Table.Cell>

              {/* Coluna Nome (compartilhada) */}
              <Table.Cell color="#036DC5">{item.name} </Table.Cell>
              
              {/* Célula da Mensagem de Status (Cor condicional) */}
              {!isSimpleList && (
                <Table.Cell color={getStatusColor((item as StatusData).hasError)} fontWeight={"bold"}>
                  {(item as StatusData).status}
                </Table.Cell>
            )}
              
            </Table.Row>
          ))}
          {data.length === 0 && (
             <Table.Row>
                <Table.Cell colSpan={2} textAlign="center" color="#036DC5">
                    Nenhum arquivo processado.
                </Table.Cell>
             </Table.Row>
          )}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
};

export default Tabela;