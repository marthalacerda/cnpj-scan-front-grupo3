import { Button } from "@chakra-ui/react";
import { IoMdDownload } from "react-icons/io";
import { FC } from "react";
// import { fetchCSV } from "../../api/download_csv";


interface DownloadCSVProps {
  csvContent: string | null;
  isDisabled: boolean;
}

// Caractere BOM para utf-8 (Byte Order Mark)
const BOM_UTF8 = '\uFEFF';

const DownloadCSV: FC<DownloadCSVProps> = ({ csvContent, isDisabled }) => {

  const handleDownload = () => {

    if (!csvContent) return;

    // Usando o conteúdo CSV passado pelo pai
    try {

      // Cria o Blob incluindo o BOM no início da string
      const contentWithBOM = BOM_UTF8 + csvContent;

      const blob = new Blob([contentWithBOM], { type: 'text/csv;charset=utf-8;' });
      // const blob = await fetchCSV();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "relatorio_cnpj_customizado.csv";
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      // alert("Download iniciado com sucesso!")
    } catch (error) {
      console.error("Erro ao baixar o arquivo:", error);
      alert("Erro ao iniciar o download.");
    }
  };

  return (
    <Button
      onClick={handleDownload}
      bg= "white"
      color= "#036DC5"
      _hover={{ bg: "#bed8f1ff" }}
      size="lg"
      rounded="md"
      boxShadow="md"
      disabled={isDisabled}
    >
      <IoMdDownload />
      Download
    </Button>
  );
}

export default DownloadCSV;
