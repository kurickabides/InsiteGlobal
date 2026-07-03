// ================================================
// ✅ Component Types: PdfViewer
// Description: Props and interfaces for PdfViewer
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: components/pdf/types.ts
// ================================================

import { PDFDocumentProxy } from "pdfjs-dist";
import React, { RefObject } from "react";

export interface PdfViewerProps {
  fileUrl: string; // PDF file path or URL
  currentPage?: number; // Current page number to display
  zoomLevel?: number; // Zoom level (e.g., 1.25 for 125%)
  maxHeight?: number; // Max viewer height to constrain scrollable area
  onLoadSuccess?: (pdf: PDFDocumentProxy) => void; // Fires on load
}
// ================================================
// ✅ Component Types: PdfToolbar
// Description: Props and control contracts for PDF toolbar
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: components/pdf/types.ts
// ================================================

export interface PdfToolbarProps {
  currentPage: number;
  numPages: number;
  zoomLevel: number;
  onPageChange: (newPage: number) => void;
  onZoomChange: (newZoom: number) => void;
  onSave: () => void; }

export interface MarkupLayerProps {
  zoom: number;
  stageRef: RefObject<any>;
  layerRef: React.RefObject<any>;
  height?: number;
  children?: React.ReactNode;
}
