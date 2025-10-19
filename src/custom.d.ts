// src/custom.d.ts

// 1. Declare the module for all PNG files
declare module '*.png' {
  // 2. Specify that the default export is a string (the image path/URL)
  const value: string;
  export default value;
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