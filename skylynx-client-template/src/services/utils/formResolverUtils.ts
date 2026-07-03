// ================================================
// ✅ Utility: resolveFormContextFromDataModel
// Description: Given a DataModel node, resolves DyForm and ViewModel children
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: formResolverUtils.ts
// ================================================

import {
  SkylynxTemplateNode,
  ProtosTemplate,
} from "../../components/core/types";

export function resolveFormContextFromDataModel(
  dataModelNode: SkylynxTemplateNode
): {
  dyFormTemplate: ProtosTemplate;
  viewModel: ProtosTemplate;
  dataModel: ProtosTemplate;
} {
  const dyFormNode = dataModelNode.children?.find(
    (c) => c.nodeName === "DyForm"
  );
  const viewModelNode = dataModelNode.children?.find(
    (c) => c.nodeName === "ViewModel"
  );

  if (!dyFormNode || !viewModelNode) {
    throw new Error(
      "Missing DyForm or ViewModel child node in DataModel node."
    );
  }

  return {
    dyFormTemplate: dyFormNode.template,
    viewModel: viewModelNode.template,
    dataModel: dataModelNode.template,
  };
}
