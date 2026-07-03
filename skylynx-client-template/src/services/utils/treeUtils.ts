// ================================================
// ✅ Utility: TreeUtils
// Description: Utility methods for working with SkylynxPortalTree
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: treeUtils.ts
// ================================================

import {
  SkylynxPortalTree,
  SkylynxTemplateNode,
  ProtosTemplate,
} from "../../components/core/types";

export class TreeUtils {
  // ✅ Find a template node by TemplateName
  static findTemplateByName(
    tree: SkylynxPortalTree,
    templateName: string
  ): ProtosTemplate | undefined {
    function search(nodes: SkylynxTemplateNode[]): ProtosTemplate | undefined {
      for (const node of nodes) {
        if (node.template.templateName === templateName) return node.template;
        if (node.children) {
          const found = search(node.children);
          if (found) return found;
        }
      }
      return undefined;
    }
    return tree.children ? search(tree.children) : undefined;
  }

  // ✅ Find a template node by TargetTypeName
  static findFirstByTargetType(
    tree: SkylynxPortalTree,
    targetType: string
  ): ProtosTemplate | undefined {
    function search(nodes: SkylynxTemplateNode[]): ProtosTemplate | undefined {
      for (const node of nodes) {
        if (node.nodeName === targetType) return node.template;
        if (node.children) {
          const found = search(node.children);
          if (found) return found;
        }
      }
      return undefined;
    }
    return tree.children ? search(tree.children) : undefined;
  }
  
  // ✅ Find a full node by TargetTypeName (not just the template)
  static findFirstNodeByType(
    tree: SkylynxPortalTree,
    targetType: string
  ): SkylynxTemplateNode | undefined {
    function search(
      nodes: SkylynxTemplateNode[]
    ): SkylynxTemplateNode | undefined {
      for (const node of nodes) {
        if (node.nodeName === targetType) return node;
        if (node.children) {
          const found = search(node.children);
          if (found) return found;
        }
      }
      return undefined;
    }
    return tree.children ? search(tree.children) : undefined;
  }

  // ✅ Return all templates with a matching TargetTypeName
  static findAllByTargetType(
    tree: SkylynxPortalTree,
    targetType: string
  ): ProtosTemplate[] {
    const result: ProtosTemplate[] = [];
    function search(nodes: SkylynxTemplateNode[]) {
      for (const node of nodes) {
        if (node.nodeName === targetType) {
          result.push(node.template);
        }
        if (node.children) {
          search(node.children);
        }
      }
    }
    if (tree.children) search(tree.children);
    return result;
  }

  // ✅ Flatten tree into list of ProtosTemplates
  static flattenTree(tree: SkylynxPortalTree): ProtosTemplate[] {
    const result: ProtosTemplate[] = [];
    function traverse(nodes: SkylynxTemplateNode[]) {
      for (const node of nodes) {
        result.push(node.template);
        if (node.children) {
          traverse(node.children);
        }
      }
    }
    if (tree.children) traverse(tree.children);
    return result;
  }
}
