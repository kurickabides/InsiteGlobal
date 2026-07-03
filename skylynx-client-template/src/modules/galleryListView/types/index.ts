// ================================================
// ✅ Types: GalleryListView Module Types
// File: modules/galleryListView/types/index.ts
// Description: Type definitions for generic image-based gallery module
// ================================================
import { SkylynxModuleSettings } from "../../../components/ui/types/uiWrappers";
import React, { ReactNode } from "react";

export interface GalleryItem {
  id: string; // Unique ID for selection
  label: string; // Display name for image or module
  description?: string; // Optional description for caption/overlay
  splashImage: string; // Public image filename or URL path
  createdDate?: string;
  lastUpdated?: string;
}

export interface PortalGalleryItem extends GalleryItem {
  status?: string; // ✅ Status shown on hover
}
export interface GalleryModuleSettings extends SkylynxModuleSettings {
  showDescription: boolean| true;
  layoutVariant: "grid" | "table" | "list";
}

export interface GalleryListViewProps {
  items: GalleryItem[];
  itemsPerPage?: number;
  onItemClick: (id: string) => void;
  settings: GalleryModuleSettings;
  onSettingsUpdate: (updated: GalleryModuleSettings) => void;
  children?: ReactNode;
}

export type GalleryState = { items: GalleryItem[] };