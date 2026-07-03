// ================================================
// ✅ Component: GalleryListView
// Description: Reusable image gallery component with layout toggle (grid/list)
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: /modules/galleryListView/GalleryListView.tsx
// ================================================

import React from "react";
import { GalleryListViewProps } from "./types";
import ModuleFrame from "../../components/ui/module/moduleFrame";
import ImageGridView from "../../components/ui/lists/ImageGridView";
import ItemListView from "../../components/ui/lists/ItemListView";
import ItemTableView from "../../components/ui/lists/ItemTableView";

const GalleryListView: React.FC<GalleryListViewProps> = ({
  items,
  itemsPerPage = 6,
  onItemClick,
  settings,
  onSettingsUpdate,
  children,
}) => {
  return (
    <ModuleFrame settings={settings} onSettingsUpdate={onSettingsUpdate}>
      {settings.layoutVariant === "table" ? (
        <ItemTableView
          items={items}
          onItemClick={onItemClick}
          onSettingsUpdate={onSettingsUpdate}
          settings={settings}
        />
      ) : settings.layoutVariant === "list" ? (
        <ItemListView
          items={items}
          onItemClick={onItemClick}
          onSettingsUpdate={onSettingsUpdate}
          settings={settings}
        />
      ) : (
        <ImageGridView
          items={items}
          onItemClick={onItemClick}
          onSettingsUpdate={onSettingsUpdate}
          settings={settings}
        />
      )}
      {children}
    </ModuleFrame>
  );
};

export default GalleryListView;
