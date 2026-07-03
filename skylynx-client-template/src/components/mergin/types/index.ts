// ================================================
// ✅ Component: IframeViewer
// Description: Lightweight wrapper to embed Mergin Maps viewer
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: components/mergin/types
// ================================================
import { SkylynxModuleSettings } from "../../../components/ui/types/uiWrappers";

export interface IframeViewerProps extends SkylynxModuleSettings {
  url: string;
  height?: number;
}
