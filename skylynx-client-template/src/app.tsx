// ================================================
// File: App Route Host
// Description: Defines Presentation Tree routes inside the reusable presentation shell.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: App.tsx
// Type: React TypeScript component file
// ================================================

import { Navigate, Route, Routes } from "react-router-dom";
import { PresentationShell } from "./components/layout/PresentationShell";
import { PresentationPage } from "./components/presentation/PresentationPage";
import { presentationTree } from "./config/presentationTree";
import { flattenPresentationTree, getFirstPresentationNode } from "./services/presentation/presentationTreeService";

const nodes = flattenPresentationTree(presentationTree);
const firstNode = getFirstPresentationNode(presentationTree);

export default function App() {
  return (
    <PresentationShell>
              <Routes>
        <Route path="/" element={<Navigate replace to={firstNode?.path ?? "/welcome"} />} />
        {nodes.map((node) => (
          <Route element={<PresentationPage node={node} />} key={node.id} path={node.path} />
        ))}
        <Route path="*" element={<Navigate replace to={firstNode?.path ?? "/welcome"} />} />
                      </Routes>
    </PresentationShell>
  );
}
