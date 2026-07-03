// ================================================
// ✅ Utility: hydrateRenderTree
// Description: Walks SkylynxPortalTree tree and hydrates each node with resolved metadata
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: services/utils/hydrateRenderTree.ts
// ================================================

import {
  SkylynxTemplateNode,
  SkylynxPortalTree,
  ITargetRegistryEntry,
  PortalNamespace,
  ITargetComponent,
  ITargetObject,
} from "../../components/core/types";
import { TargetRegistry } from "../../components/core/targetRegistry/targetRegistry";
import {
  IPortal,
  IModule,
  PortalLayoutModel,
  PortalPageModel,
} from "../../entities/portal";

/**
 * Recursively resolves all target metadata for a SkylynxTemplateNode subtree.
 * @param node - A node from the tree to hydrate
 * @param namespace - Portal namespace to use for target registry lookup
 * @returns A Promise resolving to the hydrated node
 */
async function hydrateNode(
  node: SkylynxTemplateNode,
  namespace: PortalNamespace
): Promise<SkylynxTemplateNode> {
  const hydratedNode: SkylynxTemplateNode = {
    ...node,
    template: { ...node.template },
    children: node.children ? [...node.children] : [],
  };

  const { template } = hydratedNode;

  if (template.targetID && template.templateType?.TargetTypeName) {
    try {
      const resolvedEntry: ITargetRegistryEntry = await TargetRegistry.resolve(
        template.templateType.TargetTypeName,
        template.targetID,
        namespace
      );
      
      const targetObj = resolvedEntry.data as ITargetComponent;

      if (targetObj) {
        hydratedNode.targetObject = {
          componentName: targetObj.componentName,
          componentPath: targetObj.componentPath,
          ComponentConfig: targetObj.ComponentConfig,
          data: targetObj as ITargetObject,
        };
      }
    } catch (err) {
      console.warn(
        `⚠️ Failed to resolve target for ${template.templateName} (${template.templateType.TargetTypeName}):`,
        err
      );
      hydratedNode.targetObject = {
        componentName: "",
        componentPath: "",
        ComponentConfig: "",
        data: {},
      };
    }
  }

  if (hydratedNode.children?.length) {
    hydratedNode.children = await Promise.all(
      hydratedNode.children.map((child) => hydrateNode(child, namespace))
    );
  }

  return hydratedNode;
}

/**
 * Hydrates a full SkylynxPortalTree, including its PortalTemplate and child nodes.
 * @param tree - The full portal tree object
 * @param namespace - The portal namespace (e.g., "host", "PortalA")
 * @returns A Promise resolving to the hydrated tree
 */
export async function hydrateRenderTree(
  tree: SkylynxPortalTree,
  namespace: PortalNamespace
): Promise<SkylynxPortalTree> {
  const hydratedTree: SkylynxPortalTree = {
    ...tree,
    PortalTemplate: { ...tree.PortalTemplate },
    children: tree.children ? [...tree.children] : [],
  };

  const { PortalTemplate } = hydratedTree;

  if (PortalTemplate.targetID && PortalTemplate.templateType?.TargetTypeName) {
    try {
      const resolvedEntry: ITargetRegistryEntry = await TargetRegistry.resolve(
        PortalTemplate.templateType.TargetTypeName,
        PortalTemplate.targetID,
        namespace
      );

      const targetObj = resolvedEntry.data as ITargetComponent;

      if (targetObj) {
        let pObj = targetObj as IPortal;
        hydratedTree.PortalObject = pObj;
      }
    } catch (err) {
      console.warn(
        `⚠️ Failed to resolve target for PortalTemplate (${PortalTemplate.templateType.TargetTypeName}):`,
        err
      );
      hydratedTree.PortalObject = {
        PortalID: "Missing Component",
        PortalName: "Missing Name",
        Description: "Missing Description",
        SplashImage: "Missing Image",
        Status: "Error",
        componentName: "",
        componentPath: "",
        ComponentConfig: "",
      };
    }
  }

  if (hydratedTree.children?.length) {
    hydratedTree.children = await Promise.all(
      hydratedTree.children.map((child) => hydrateNode(child, namespace))
    );
  }

  return hydratedTree;
}
