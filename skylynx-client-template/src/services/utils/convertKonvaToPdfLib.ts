// ================================================
// ✅ Utility: convertKonvaToPdfLib
// Description: Converts Konva layer markup into pdf-lib drawing instructions
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: services/utils/convertKonvaToPdfLib.ts
// ================================================

import { PDFPage, rgb } from "pdf-lib";
import Konva from "konva";

export interface ConvertOptions {
  pageHeight: number;
  defaultColor?: { r: number; g: number; b: number };
}

export const convertKonvaToPdfLib = (
  layer: Konva.Layer,
  page: PDFPage,
  options: ConvertOptions
): void => {
  const { pageHeight, defaultColor = { r: 0, g: 0, b: 0 } } = options;

  layer.getChildren().forEach((node) => {
    if (!node.visible()) return;

    const x = node.x();
    const y = node.y();
    const shape = node as any;

    const fill = typeof shape.fill === "function" ? shape.fill() : undefined;
    const stroke =
      typeof shape.stroke === "function" ? shape.stroke() : undefined;
    const strokeWidth =
      typeof shape.strokeWidth === "function" ? shape.strokeWidth() : 1;

    if (node instanceof Konva.Rect) {
      const width = node.width();
      const height = node.height();

      page.drawRectangle({
        x,
        y: pageHeight - y - height,
        width,
        height,
        color:
          typeof fill === "string" ? parseColor(fill, defaultColor) : undefined,
        borderWidth: strokeWidth,
        borderColor:
          typeof stroke === "string"
            ? parseColor(stroke, defaultColor)
            : undefined,
      });
    } else if (node instanceof Konva.Text) {
      const text = node.text();
      const fontSize = node.fontSize();

      page.drawText(text, {
        x,
        y: pageHeight - y - fontSize,
        size: fontSize,
        color:
          typeof fill === "string" ? parseColor(fill, defaultColor) : undefined,
      });
    } else if (node instanceof Konva.Line && node.points().length >= 4) {
      const points = node.points();
      for (let i = 0; i < points.length - 2; i += 2) {
        const x1 = points[i];
        const y1 = points[i + 1];
        const x2 = points[i + 2];
        const y2 = points[i + 3];

        page.drawLine({
          start: { x: x1, y: pageHeight - y1 },
          end: { x: x2, y: pageHeight - y2 },
          thickness: strokeWidth,
          color:
            typeof stroke === "string"
              ? parseColor(stroke, defaultColor)
              : undefined,
        });
      }
    }

    // ✅ Circle
    else if (node instanceof Konva.Circle) {
      const radius = node.radius();

      page.drawCircle({
        x,
        y: pageHeight - y,
        size: radius,
        color:
          typeof fill === "string" ? parseColor(fill, defaultColor) : undefined,
        borderWidth: strokeWidth,
        borderColor:
          typeof stroke === "string"
            ? parseColor(stroke, defaultColor)
            : undefined,
      });
    }

    // ✅ Ellipse
    else if (node instanceof Konva.Ellipse) {
      const radiusX = node.radiusX();
      const radiusY = node.radiusY();

      // Draw ellipse using scaled circle approximation
      const ellipseX = x;
      const ellipseY = pageHeight - y;

      page.drawEllipse({
        x: ellipseX,
        y: ellipseY,
        xScale: radiusX,
        yScale: radiusY,
        color:
          typeof fill === "string" ? parseColor(fill, defaultColor) : undefined,
        borderWidth: strokeWidth,
        borderColor:
          typeof stroke === "string"
            ? parseColor(stroke, defaultColor)
            : undefined,
      });
    }

    // ✅ Arrow
    else if (node instanceof Konva.Arrow && node.points().length >= 4) {
      const points = node.points();
      for (let i = 0; i < points.length - 2; i += 2) {
        const x1 = points[i];
        const y1 = points[i + 1];
        const x2 = points[i + 2];
        const y2 = points[i + 3];

        page.drawLine({
          start: { x: x1, y: pageHeight - y1 },
          end: { x: x2, y: pageHeight - y2 },
          thickness: strokeWidth,
          color:
            typeof stroke === "string"
              ? parseColor(stroke, defaultColor)
              : undefined,
        });
      }
    }

    // TODO: Add more Konva shapes here (Star, Image, Transformer, etc.)
  });
};

const parseColor = (
  color: string | undefined,
  fallback: { r: number; g: number; b: number }
) => {
  if (!color) return rgb(fallback.r, fallback.g, fallback.b);

  const colors: Record<string, [number, number, number]> = {
    red: [1, 0, 0],
    green: [0, 1, 0],
    blue: [0, 0, 1],
    black: [0, 0, 0],
    white: [1, 1, 1],
    yellow: [1, 1, 0],
    orange: [1, 0.65, 0],
    purple: [0.5, 0, 0.5],
    gray: [0.5, 0.5, 0.5],
  };

  const c = colors[color.toLowerCase()] || [fallback.r, fallback.g, fallback.b];
  return rgb(...c);
};
