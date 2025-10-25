import { Routes, Route, useLocation, Link } from "react-router-dom";
import HomePage from './pages/HomePage';
import { ExtractionProvider } from "./context/ExtractionContext";
import FileListPage from "./pages/FileListPage";
import LoadingPage from "./pages/LoadingPage";
// import ResultPage from "./pages/ResultPage";
import ReportPage from "./pages/ReportPage";
import ProcessPage from './pages/ProcessPage';
// import DownloadPage from './pages/DownloadPage';

function App() {

  return (
    <ExtractionProvider>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/arquivos" element={<FileListPage/>} />
        <Route path="/extracao" element={<LoadingPage/>} /> 
        {/* <Route path="/resultado" element={<ResultPage/>} /> */}
        <Route path="/resultado" element={<ProcessPage/>} />
        <Route path="/relatorio" element={<ReportPage/>} />
      </Routes>
    </ExtractionProvider>
  );
}

export default App;