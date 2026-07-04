// ================================================
// File: Presentation Tree Service
// Description: Provides helpers for flattening and navigating guided presentation nodes.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: presentationTreeService.ts
// Type: TypeScript service file
// ================================================

import { PresentationNode } from "../../types/presentation";

export function flattenPresentationTree(nodes: PresentationNode[]): PresentationNode[] {
  return nodes.flatMap((node) => [
    node,
    ...flattenPresentationTree(node.children ?? [])
  ]);
}

export function getFirstPresentationNode(nodes: PresentationNode[]): PresentationNode | undefined {
  return flattenPresentationTree(nodes)[0];
}

export function getPresentationNodeById(nodes: PresentationNode[], id: string): PresentationNode | undefined {
  return flattenPresentationTree(nodes).find((node) => node.id === id);
}

export function getPresentationNodeByPath(nodes: PresentationNode[], path: string): PresentationNode | undefined {
  return flattenPresentationTree(nodes).find((node) => node.path === path);
}

export function getAdjacentPresentationNodes(nodes: PresentationNode[], activeNodeId: string) {
  const flattenedNodes = flattenPresentationTree(nodes);
  const activeIndex = flattenedNodes.findIndex((node) => node.id === activeNodeId);

  return {
    previousNode: activeIndex > 0 ? flattenedNodes[activeIndex - 1] : undefined,
    currentNode: activeIndex >= 0 ? flattenedNodes[activeIndex] : undefined,
    nextNode: activeIndex >= 0 ? flattenedNodes[activeIndex + 1] : undefined,
    activeIndex,
    totalNodes: flattenedNodes.length
  };
}
