// ================================================
// File: Presentation State Slice
// Description: Tracks guided presentation progress and navigation mode in Redux.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: presentationSlice.ts
// Type: TypeScript Redux slice file
// ================================================

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { presentationTree } from "@/config/presentationTree";
import { getAdjacentPresentationNodes, getFirstPresentationNode } from "@/services/presentation/presentationTreeService";
import { PresentationMode, PresentationState } from "@/types/presentation";

const firstNode = getFirstPresentationNode(presentationTree);

const initialState: PresentationState = {
  activeNodeId: firstNode?.id ?? "",
  completedNodeIds: [],
  mode: "guided"
};

export const presentationSlice = createSlice({
  name: "presentation",
  initialState,
  reducers: {
    setActiveNode: (state, action: PayloadAction<string>) => {
      if (state.activeNodeId && !state.completedNodeIds.includes(state.activeNodeId)) {
        state.completedNodeIds.push(state.activeNodeId);
      }

      state.activeNodeId = action.payload;
    },
    goToNextNode: (state) => {
      const { nextNode } = getAdjacentPresentationNodes(presentationTree, state.activeNodeId);

      if (nextNode) {
        if (state.activeNodeId && !state.completedNodeIds.includes(state.activeNodeId)) {
          state.completedNodeIds.push(state.activeNodeId);
        }

        state.activeNodeId = nextNode.id;
      }
    },
    goToPreviousNode: (state) => {
      const { previousNode } = getAdjacentPresentationNodes(presentationTree, state.activeNodeId);

      if (previousNode) {
        state.activeNodeId = previousNode.id;
      }
    },
    setPresentationMode: (state, action: PayloadAction<PresentationMode>) => {
      state.mode = action.payload;
    },
    resetPresentation: () => initialState
  }
});

export const {
  goToNextNode,
  goToPreviousNode,
  resetPresentation,
  setActiveNode,
  setPresentationMode
} = presentationSlice.actions;

export default presentationSlice.reducer;
