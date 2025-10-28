/**
 * DataTable Component - Dynamic Table with API Integration
 * Path: C:\Users\Pedro\Documents\vscode\NeXT\Projeto_CS\CNPJ-SCAN-FRONT\src\components\ui\DataTable.tsx
 * 
 * Componente de tabela dinâmica que se conecta com FastAPI
 */

import React, { useState, useEffect, FC, useMemo } from 'react';
import {
  Box,
  Button,
  Flex,
  Spinner,
  Text,
  Table,
} from '@chakra-ui/react';

import { Tbody, Thead, Tr, Th, Td } from '@chakra-ui/table';

// import { fetchExtractedData, type DataRow } from '../../api/post_csv';


// Interface para as Props
interface DataTableProps {
  csvContent: string | null;
  selectedFields: string[];
  title?: string;
  minHeight?: string;

  // /** Callback executado quando os dados são carregados */
  // onDataLoaded?: (data: DataRow[]) => void;
  
  // /** Filtros personalizados para enviar na requisição */
  // filters?: Record<string, any>;
  
  // /** Mostrar botão de download CSV */
  // showDownloadButton?: boolean;
}

// ---------------------------------------------------------------------
// Funções auxiliares/utilitárias (mover para arquivo "util.ts" ??? )
// ---------------------------------------------------------------------

const CSV_DELIMITER = ';';

// Converte a string CSV para uma lista de objetos [{..}, {..}, ..]
const parseCSV = (csv: string): Record<string, any>[] => {
  if (!csv) return [];

  // Divide por linha e remove linhas vazias
  const rows = csv.trim().split('\n').filter(row => row.length > 0);

  if (rows.length === 0) return [];

  // Usa a primeira linha como cabeçalho
  const headers = rows[0].split(CSV_DELIMITER).map(header => header.trim().replace(/"/g, ''));

  const data = rows.slice(1).map(row => {
    const values = row.split(CSV_DELIMITER).map(v => v.trim().replace(/"/g, ''));
    const obj: Record<string, any> = {};
    headers.forEach((header, index) => {
      obj[header] = values[index];
    });
    return obj;    
  });

  return data;
};

// ----------------------------------------------------------------------

const DynamicTable: FC<DataTableProps> = ({
  // onDataLoaded,
  csvContent,
  selectedFields,
  // filters = {},
  title = 'CSV gerado com sucesso!',
  // showDownloadButton = true,
  minHeight = '400px',
}: DataTableProps) => {

  // const [data, setData] = useState<DataRow[]>([]);
  // const [columns, setColumns] = useState<string[]>([]);
  
  // Estado de dados calculado a partir do csvContent
  const tableData = useMemo(() => parseCSV(csvContent || ""), [csvContent]);
  const columns = useMemo(() => tableData.length > 0 ? Object.keys(tableData[0]) : [], [tableData]);

  // Estados para erro e carregamento
  const isReady = csvContent !== null && !csvContent.startsWith("ERRO");
  const isLoading = csvContent === null;
  // const [loading, setLoading] = useState(false);
  const isError = csvContent && csvContent.startsWith("ERRO");
  
  // const [error, setError] = useState<string | null>(null);
  // const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // lastUpdate é calculado só se tiver dados
  const lastUpdate = useMemo(() => isReady ? new Date() : null, [isReady]);
  
  

  /**
   * Renderização: Loading State
   */
  if (isLoading) {
    return (
      <Box minH={minHeight}>
        <Flex justify="center" align="center" h="100%" direction="column" gap={4}>
          <Spinner size="xl" color="blue.500" />
          <Text color="gray.600" fontSize="sm">
            Carregando dados do servidor...
          </Text>
        </Flex>
      </Box>
    );
  }

  /**
   * Renderização: Error State
   */
  if (isError) {
    return (
      <Box minH={minHeight}>
        <Flex
          justify="center"
          align="center"
          h="100%"
          direction="column"
          gap={4}
          bg="red.50"
          borderRadius="lg"
          p={8}
        >
          <Text color="red.600" fontWeight="semibold" textAlign="center">
            {csvContent!.replace("ERRO", "")}
          </Text>
          {/* <Button 
            colorScheme="red" 
            variant="outline" 
            //onClick={loadData} 
            size="sm"
          >
            Tentar Novamente
          </Button> */}
        </Flex>
      </Box>
    );
  }

  /**
   * Renderização: Empty State
   */
  if (tableData.length === 0) {
    return (
      <Box minH={minHeight}>
        <Flex
          justify="center"
          align="center"
          direction="column"
          bg="gray.50"
          borderRadius="lg"
        >
          <Text fontSize="4xl">📭</Text>
          <Text color="gray.600" fontWeight="semibold">
            Nenhum dado disponível
          </Text>
          {/* <Button
            colorScheme="blue" 
            variant="ghost" 
            // onClick={loadData} 
            size="sm"
          >
            Recarregar
          </Button> */}
        </Flex>
      </Box>
    );
  }

  /**
   * Renderização: Tabela com Dados
   */
  return (
    <Box w="100%" h="100%">
      {/* Header da Tabela */}
      <Flex
        bg="gray.50"
        px={6}
        py={4}
        borderRadius="lg"
        mb={4}
        justify="space-between"
        align="center"
        flexWrap="wrap"
      >
        <Flex align="center" gap="5px">
          <Box>
            <Text fontWeight="bold" color= "#036DC5" fontSize="lg">
              {title}
            </Text>
            {lastUpdate && (
              <Text fontSize="xs" color="gray.500">
                Atualizado às {lastUpdate.toLocaleTimeString('pt-BR')}
              </Text>
            )}
          </Box>
        </Flex>
        <Flex gap="2px">
        </Flex>
      </Flex>

      {/* Tabela */}
        <Box
          bg="white"
          borderRadius="lg"
          overflow="hidden"
          border="0.5px"
          borderColor="gray.200"
        >
          <Box overflowX="auto" maxH="500px" maxW="100%">
            <Table.Root size="sm" variant="line" tableLayout="fixed">
              <Table.Header minW="50px">
                <Table.Row bg="blue.50">
                  {columns.map((column) => (
                    <Table.ColumnHeader
                      key={column}
                      color="blue.700"
                      fontWeight="bold"
                      fontSize="sm"
                      textTransform="capitalize"
                      maxW="50px">
                      {column.replaceAll('_', ' ')}
                    </Table.ColumnHeader>
                  ))}
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {tableData.map((row, i) => (
                  <Table.Row
                    key={i}
                    _hover={{ bg: 'blue.50' }}
                  >
                    {columns.map((col) => (
                      <Table.Cell
                        key={col}
                        color="gray.700"
                        maxW="60px"
                        whiteSpace="nowrap" 
                        overflow="hidden"
                        textOverflow="ellipsis"
                      >
                        {String(row[col] ?? '')}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        </Box>

        {/* Footer com contador */}
        <Flex
          justify="space-between"
          align="center"
          bg="gray.50"
          borderColor="gray.200"
        >
          <Text fontSize="sm" color="gray.600">
            Total de registros: <strong>{tableData.length}</strong>
          </Text>

          <Text fontSize="xs" color="gray.500">
            {columns.length} colunas
          </Text>
        </Flex>
    </Box>
  );
}

export default DynamicTable;