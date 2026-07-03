// ================================================
// ✅ Component: EDPDFModuleContainer
// Description: Redux-connected container for the PDF markup module
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: /modules/edPDFModule/EDPDFModuleContainer.tsx
// ================================================

import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPdfSettings, updateSettings } from "./edPDFSlice";
import EDPDFModuleView from "./edPDFModuleView";
import { EDPDFModuleProps } from "./types";
import { PDFDocument } from "pdf-lib";
import { convertKonvaToPdfLib } from "../../services/utils/convertKonvaToPdfLib";
import saveAs from "file-saver";

const EDPDFModuleContainer: React.FC<EDPDFModuleProps> = ({
  settings,
  onSettingsUpdate,
}) => {
  const dispatch = useDispatch();
  const savedSettings = useSelector(selectPdfSettings);
  const stageRef = useRef<any>(null); // ✅ maintain ref to access Konva markup layer

  const mergedSettings = { ...savedSettings, ...settings };

  const handleUpdate = (updated: Partial<typeof settings>) => {
    dispatch(updateSettings(updated));
    onSettingsUpdate?.({ ...mergedSettings, ...updated });
  };

  const handleSave = async () => {
    try {
      const pdfUrl = mergedSettings.pdfPath ?? "/content/sample.pdf";
      const existingPdfBytes = await fetch(pdfUrl).then((res) =>
        res.arrayBuffer()
      );
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      const pageIndex = 0; // Default to first page, can pass currentPage if needed
      const page = pdfDoc.getPage(pageIndex);

      const layer = stageRef.current?.findOne("Layer[name=markupLayer]");
      if (!layer) throw new Error("Markup layer not found");

      convertKonvaToPdfLib(layer, page, {
        pageHeight: page.getHeight(),
        defaultColor: { r: 1, g: 0, b: 0 },
      });

      const pdfBytes = await pdfDoc.save();
      saveAs(
        new Blob([pdfBytes], { type: "application/pdf" }),
        "annotated.pdf"
      );
    } catch (err) {
      console.error("❌ Save PDF failed:", err);
      alert("Failed to save annotated PDF.");
    }
  };

  return (
    <EDPDFModuleView
      settings={mergedSettings}
      onSettingsUpdate={handleUpdate}
      onSave={handleSave}
      stageRef={stageRef} // ✅ passed in so View doesn't own ref lifecycle
    />
  );
};

export default EDPDFModuleContainer;
