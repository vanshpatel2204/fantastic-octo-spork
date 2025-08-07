import React from "react";
import PDFGenerator from "./PDFGenerator";

function App() {
  return (
    <div>
      <head>
        <title>Image to PDF Converter | JPG to PDF | AI Tool</title>
      </head>
      <h1 style={{ textAlign: "center", marginTop: "20px" }}>
        🖼️ Image to PDF Generator
      </h1>
      <PDFGenerator />
    </div>
  );
}

export default App;
