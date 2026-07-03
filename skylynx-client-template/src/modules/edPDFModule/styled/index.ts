// ================================================
// ✅ Styled: PDFWrapper
// Description: Styled wrapper for PDF and canvas overlay
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: /modules/EDPDFModule/styled/pdfWrapper.ts
// ================================================

import styled from "@emotion/styled";

export const PDFWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: "auto",
  maxHeight: "600px", // Optional
  overflow: "auto", // ✅ Add this
}));
