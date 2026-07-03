// ================================================
// ✅ Component: EDPDFModuleView
// Description: Engineering Design Markup Module (PDF version)
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: /modules/EDPDFModule/EDPDFModuleView.tsx
// ================================================

import React, { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import saveAs from "file-saver";
import ModuleFrame from "../../components/ui/module/moduleFrame";
import PdfViewer from "../../components/pdf/pdfViewer";
import PdfToolbar from "../../components/pdf/pdfToolbar";
import { PDFWrapper } from "./styled";
import ContainerMixins from "../../theme/themeMixins";
import { EDPDFModuleProps } from "./types";
import MarkupLayer from "../../components/pdf/markupLayer";
import { convertKonvaToPdfLib } from "../../services/utils/convertKonvaToPdfLib";

const EDPDFModuleView: React.FC<EDPDFModuleProps> = ({
  settings,
  onSettingsUpdate,
  onSave,
  stageRef,
  children,
}) => {
  const layerRef = useRef<any>(null); // ✅ New layer ref
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState<number>(
    settings.defaultZoomLevel ?? 1
  );

  const { pdfCanvas } = ContainerMixins;

  const scaledWidth = pdfCanvas.width * zoomLevel;
  const scaledHeight = pdfCanvas.height * zoomLevel;
  const pdfUrl = settings.pdfPath ?? "/content/sample.pdf";

  const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleZoomChange = (newZoom: number) => {
    setZoomLevel(newZoom);
  };

  const handleSave = async () => {
    try {
      console.log("📥 Starting save...");
      const existingPdfBytes = await fetch(pdfUrl).then((res) =>
        res.arrayBuffer()
      );
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const page = pdfDoc.getPage(currentPage - 1);

      const layer = layerRef.current;
      if (!layer) throw new Error("Markup layer not found.");
      console.log("✅ Markup layer retrieved:", layer);

      convertKonvaToPdfLib(layer, page, {
        pageHeight: page.getHeight(),
        defaultColor: { r: 1, g: 0, b: 0 },
      });

      const pdfBytes = await pdfDoc.save();
      saveAs(
        new Blob([pdfBytes], { type: "application/pdf" }),
        "annotated.pdf"
      );
      console.log("✅ Annotated PDF saved.");
    } catch (error) {
      console.error("❌ Save PDF failed:", error);
      alert("Failed to save annotated PDF.");
    }
  };

  return (
    <ModuleFrame settings={settings} onSettingsUpdate={onSettingsUpdate}>
      {settings.showToolbar && (
        <PdfToolbar
          currentPage={currentPage}
          numPages={numPages ?? 1}
          zoomLevel={zoomLevel}
          onZoomChange={handleZoomChange}
          onPageChange={setCurrentPage}
          onSave={handleSave}
        />
      )}

      <PDFWrapper style={{ width: "100%" }}>
        <PdfViewer
          fileUrl={pdfUrl}
          zoomLevel={zoomLevel}
          maxHeight={settings.maxHeight || 600}
          currentPage={currentPage}
          onLoadSuccess={handleLoadSuccess}
        />

        <MarkupLayer
          zoom={zoomLevel}
          stageRef={stageRef}
          layerRef={layerRef} // ✅ Pass to layer
          height={scaledHeight}
        />
      </PDFWrapper>

      {children}
    </ModuleFrame>
  );
};

export default EDPDFModuleView;
