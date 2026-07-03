// ================================================
// ✅ Component: MarkupLayer
// Description: Renders Konva canvas overlay for annotations
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: components/pdf/markupLayer.tsx
// ================================================

import React from "react";
import { Stage, Layer, Rect, Text } from "react-konva";
import { OverlayCanvas } from "./styled";
import ContainerMixins from "../../theme/themeMixins";
import { MarkupLayerProps } from "./types";

const MarkupLayer: React.FC<MarkupLayerProps> = ({
  zoom,
  stageRef,
  layerRef,
}) => {
  const { pdfCanvas, markupBox, markupText } = ContainerMixins;

  const baseWidth = pdfCanvas.width;
  const baseHeight = pdfCanvas.height;

  return (
    <OverlayCanvas style={{ width: baseWidth, height: baseHeight }}>
      <Stage
        ref={stageRef}
        width={baseWidth}
        height={baseHeight}
        scaleX={zoom}
        scaleY={zoom}
      >
        {/* ✅ Name the layer so it can be targeted via stageRef.findOne(...) */}
        <Layer name="markupLayer" ref={layerRef}>
          <Rect
            x={markupBox.x}
            y={markupBox.y}
            width={markupBox.width}
            height={markupBox.height}
            fill={markupBox.fill}
          />
          <Text
            x={markupBox.x + 10}
            y={markupBox.y + 10}
            text="Map Center"
            fontSize={markupText.fontSize}
            fill={markupText.color}
          />
        </Layer>
      </Stage>
    </OverlayCanvas>
  );
};

export default MarkupLayer;
