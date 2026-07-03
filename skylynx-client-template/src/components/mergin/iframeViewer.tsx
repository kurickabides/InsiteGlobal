// ================================================
// ✅ Component: IframeViewer
// Description: Lightweight wrapper to embed Mergin Maps viewer
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: components/mergin/iframeViewer.tsx
// ================================================

import React from "react";
import { IframeViewerProps } from "./types";
import { ContainerMapViewer, TitleMapViewer, IframeMapViewer } from "./styled";

const IframeViewer: React.FC<IframeViewerProps> = ({
  url,
  height = 600,
  title = "Mergin Maps Viewer",
}) => {
  return (
    <ContainerMapViewer>
      <TitleMapViewer variant="h6">{title}</TitleMapViewer>
      <IframeMapViewer
        src={url}
        height={height}
        title={title}
        allowFullScreen
        loading="lazy"
      />
    </ContainerMapViewer>
  );
};

export default IframeViewer;
