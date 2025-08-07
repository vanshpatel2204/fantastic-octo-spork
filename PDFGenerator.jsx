import React, { useState } from "react";
import jsPDF from "jspdf";

function PDFGenerator() {
  const [images, setImages] = useState([]);
  const [pdfTitle, setPdfTitle] = useState("image-to-pdf");

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageObjs = files.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...imageObjs]);
  };

  const handleDrag = (e, index) => {
    e.dataTransfer.setData("dragIndex", index);
  };

  const handleDrop = (e, dropIndex) => {
    const dragIndex = e.dataTransfer.getData("dragIndex");
    if (dragIndex === null) return;
    const reordered = [...images];
    const [dragged] = reordered.splice(dragIndex, 1);
    reordered.splice(dropIndex, 0, dragged);
    setImages(reordered);
  };

  const generatePDF = async () => {
    if (images.length === 0) return alert("Please upload some images first.");

    const pdf = new jsPDF();
    for (let i = 0; i < images.length; i++) {
      const img = new Image();
      img.src = images[i].url;
      await new Promise((resolve) => {
        img.onload = () => {
          const imgWidth = pdf.internal.pageSize.getWidth();
          const imgHeight = (img.height * imgWidth) / img.width;
          if (i !== 0) pdf.addPage();
          pdf.addImage(img, "JPEG", 0, 0, imgWidth, imgHeight);
          resolve();
        };
      });
    }

    pdf.save(`${pdfTitle.trim() || "image-to-pdf"}.pdf`);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <input
        type="text"
        value={pdfTitle}
        onChange={(e) => setPdfTitle(e.target.value)}
        placeholder="Enter PDF file name"
        style={{
          padding: "10px",
          width: "250px",
          marginBottom: "15px",
          borderRadius: "5px",
        }}
      />
      <br />
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageUpload}
        style={{ marginBottom: "15px" }}
      />
      <br />
      {images.length > 0 && <h3>🟰 Drag-and-drop to reorder</h3>}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "15px",
          marginTop: "10px",
        }}
      >
        {images.map((img, index) => (
          <div
            key={img.id}
            draggable
            onDragStart={(e) => handleDrag(e, index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, index)}
            style={{
              border: "2px dashed #ccc",
              padding: "5px",
              borderRadius: "5px",
              cursor: "grab",
            }}
          >
            <img
              src={img.url}
              alt={`preview-${index}`}
              style={{ width: "100px", height: "auto" }}
            />
          </div>
        ))}
      </div>
      {images.length > 0 && (
        <button
          onClick={generatePDF}
          style={{
            marginTop: "25px",
            padding: "12px 25px",
            backgroundColor: "#4caf50",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "16px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          📄 Generate PDF
        </button>
      )}
    </div>
  );
}

export default PDFGenerator;
