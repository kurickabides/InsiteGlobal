// ================================================ 
// ✅ Component: UserProfileModule
// Description: Loads and renders user profile from DyForm metadata
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: modules/userProfileManagement/UserProfileModule.tsx
// ================================================

import React from "react";
import { useAppSelector } from "../../hooks/reduxHooks";
import ModuleFrame from "../../components/ui/module/moduleFrame";
import DyFormRenderer from "../../components/dyForm/dyFormRenderer";
import { TreeUtils } from "../../services/utils/treeUtils";
import { resolveFormContextFromDataModel } from "../../services/utils/formResolverUtils";
import { SkylynxModuleSettings } from "../../components/ui/types/uiWrappers";
import { UserProfileModuleProps } from "./types";

const UserProfileModule: React.FC<UserProfileModuleProps> = ({
   settings,
  onSettingsUpdate,
}) => {
  const portalTree = useAppSelector((state) => state.skylynxPortalTree.tree);

  if (!portalTree) return <div>Loading Portal Tree...</div>;

  const dataModelNode = TreeUtils.findFirstNodeByType(portalTree, "DataModel");

  if (!dataModelNode) return <div>No DataModel found for User Profile</div>;

  let context;
  try {
    context = resolveFormContextFromDataModel(dataModelNode);
  } catch (err) {
    return <div>Error resolving form context: {(err as Error).message}</div>;
  }

  const moduleSettings: SkylynxModuleSettings = {
    title: "User Profile",
    showTitle: true,
  };

  return (
    <ModuleFrame settings={moduleSettings} onSettingsUpdate={onSettingsUpdate}>
      <DyFormRenderer
        dyFormTemplate={context.dyFormTemplate}
        viewModel={context.viewModel}
        dataModel={context.dataModel}
      />
    </ModuleFrame>
  );
};

export default UserProfileModule;
