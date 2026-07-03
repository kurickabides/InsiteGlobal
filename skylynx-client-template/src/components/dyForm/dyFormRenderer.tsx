// ================================================
// ✅ Component: DyFormRenderer
// Description: Builds a dynamic form from DyForm metadata + ViewModel
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: DyFormRenderer.tsx
// ================================================

import React, { FC } from "react";
import { ProtosTemplate } from "../core/types";
import { FormRoot, SectionDivider, ParagraphText } from "../../theme/appStyles";

interface DyFormRendererProps {
  dyFormTemplate: ProtosTemplate;
  viewModel: ProtosTemplate;
  dataModel: ProtosTemplate;
}

const DyFormRenderer: FC<DyFormRendererProps> = ({
  dyFormTemplate,
  viewModel,
  dataModel,
}) => {
  return (
    <FormRoot>
      <ParagraphText>🧪 Form Rendering Not Implemented Yet</ParagraphText>
      <SectionDivider />
      <ParagraphText>Template: {dyFormTemplate.templateName}</ParagraphText>
      <ParagraphText>ViewModel: {viewModel.templateName}</ParagraphText>
      <ParagraphText>DataModel: {dataModel.templateName}</ParagraphText>
    </FormRoot>
  );
};

export default DyFormRenderer;
