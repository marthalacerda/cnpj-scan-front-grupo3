import { Routes, Route, useLocation, Link } from "react-router-dom";
import HomePage from './pages/HomePage';
import { ExtractionProvider } from "./context/ExtractionContext";
import FileListPage from "./pages/FileListPage";
import LoadingPage from "./pages/LoadingPage";
import ResultPage from "./pages/ResultPage";
// import ProcessPage from './pages/ProcessPage';
// import DownloadPage from './pages/DownloadPage';

function App() {

  return (
    <ExtractionProvider>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/arquivos" element={<FileListPage/>} />
        {/* Rota para o loading, com o ID do arquivo na URL */}
        <Route path="/status/:fileId" element={<LoadingPage/>} /> 
        {/* Rota para o resultado, com o ID do arquivo na URL */}
        <Route path="/resultado/:fileId" element={<ResultPage/>} />
      </Routes>
    </ExtractionProvider>
  );
}

export default App;