// ================================================
// ✅ Types: EDPDFModule
// Description: Type definitions for Engineering Design PDF Markup Module
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: /modules/EDPDFModule/types.ts
// ================================================

import { SkylynxModuleSettings } from "../../../components/ui/types/uiWrappers";

// ✅ Drawing tools enum
export type EDPDFTool = "select" | "drawRect" | "text" | "photo";

// ✅ Layout variants for rendering
export type EDPDFLayoutVariant = "canvas" | "pdf";

// ✅ Main settings interface
export interface EDPDFModuleSettings extends SkylynxModuleSettings {
  pdfPath?: string;
  showToolbar?: boolean;
  maxHeight?: number;
  drawingScale?: string; // e.g., "1:500", "1in=40ft"
  enableDynamicScale?: boolean;
  layoutVariant?: EDPDFLayoutVariant;
  defaultZoomLevel: number;
  enableZoom?: boolean;
  enablePan?: boolean;
  enablePageNav?: boolean;
  defaultTool?: EDPDFTool;
  markupColor?: string;
  enablePhotoOverlay?: boolean;
  enableFormAnnotations?: boolean;
  markupDataSourceID?: string;
  snapToGrid?: boolean;
  showRulerOverlay?: boolean;
  showScaleIndicator?: boolean;
  highlightOnHover?: boolean;
  autoSaveInterval?: number;
  persistViewport?: boolean;
  center?: [number, number]; // viewport center override
}

// ✅ Shape types
export type EDPDFShapeType = "rect" | "text" | "arrow";

// ✅ Base shape
export interface EDPDFShapeBase {
  id: string;
  type: EDPDFShapeType;
  x: number;
  y: number;
  page: number;
  fill?: string;
  stroke?: string;
}

// ✅ Specific shape variants
export interface EDPDFRect extends EDPDFShapeBase {
  type: "rect";
  width: number;
  height: number;
}

export interface EDPDFText extends EDPDFShapeBase {
  type: "text";
  text: string;
  fontSize?: number;
}

export interface EDPDFArrow extends EDPDFShapeBase {
  type: "arrow";
  points: number[]; // [x1, y1, x2, y2]
}

// ✅ Union shape type
export type EDPDFShape = EDPDFRect | EDPDFText | EDPDFArrow;

// ✅ Shape reducer state
export interface EDPDFModuleState {
  settings: EDPDFModuleSettings;
  shapes?: EDPDFShape[];
}

// ✅ OCR result (from vision or user-selection)
export interface EDPDFOCRResult {
  page: number;
  box: { x: number; y: number; width: number; height: number };
  text: string;
}

// ✅ Toolbar event handlers
export interface MarkupToolbarCallbacks {
  onAddShape: (shape: EDPDFShape) => void;
  onClearShapes?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onOCRRegionSelect?: () => void;
}

// ✅ Props for the module wrapper
export interface EDPDFModuleProps {
  settings: EDPDFModuleSettings;
  onSettingsUpdate: (settings: EDPDFModuleSettings) => void;
  children?: React.ReactNode;
  onSave?: () => void;
  stageRef?: React.RefObject<any>;
}
