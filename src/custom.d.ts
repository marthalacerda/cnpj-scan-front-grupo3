// 1. Declare the module for all PNG files
declare module '*.png' {
  // 2. Specify that the default export is a string (the image path/URL)
  const value: string;
  export default value;
}

// --- ⚠️ SOLUÇÃO PARA O ERRO IMPORT.META.ENV ---

interface ImportMetaEnv {
  readonly VITE_API_BASE_PATH: string;
  // Adicione outras variáveis de ambiente aqui se existirem
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// You can add other asset types here too, like:
/*
declare module '*.svg' {
  const content: any;
  export default content;
}
declare module '*.jpg';
declare module '*.jpeg';
*/