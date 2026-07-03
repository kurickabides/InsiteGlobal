// ================================================
// ✅ Styled: PdfViewer Styles
// Description: Styles for PDF Viewer container, scroll area, and page rendering
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: components/pdf/styled.ts
// ================================================

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

// 🖼️ Main container with scroll control
export const ContainerPdfViewer = styled(Box)<{ maxHeight?: number }>(
  ({ maxHeight, theme }) => ({
    width: "100%",
    // 🚫 Remove scrollbars here
    overflow: "visible", // ✅ prevent hidden or scroll triggers
    maxHeight: maxHeight ? `${maxHeight}px` : "auto",
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
  })
);


// 📄 Wrapper around each individual PDF page
export const PageWrapperPdfViewer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(2),
}));

// 🧭 Scroll container for paged navigation or long forms
// 🧭 Scroll container with horizontal scroll
export const ScrollWrapperPdfViewer = styled("div")({
  width: "100%",
  padding: "1rem",
  display: "flex",
  flexDirection: "column",
});

// 📌 Toolbar wrapper container
export const ToolbarPdfViewer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(1),
  backgroundColor: theme.palette.grey[100],
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

// 📌 Grouped buttons (left side)
export const ButtonGroupPdfViewer = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
}));

// 📌 Page control (right side)
export const PageInfoPdfViewer = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  gap: "0.25rem",
}));

// 🧾 Overlay canvas for Konva annotations
export const OverlayCanvas = styled("div")(() => ({
  position: "absolute",
  top: 0,
  left: 0,
  zIndex: 10,
  pointerEvents: "none",
  width: "100%",
  height: "100%", // allows click-through to PDF
}));