// ================================================
// ✅ Container: GalleryListContainer
// Description: Wires GalleryListView to Redux state (Container-View pattern)
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: /modules/galleryListView/GalleryListContainer.tsx
// ================================================

import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/reduxHooks";
import { selectGalleryItems, setGalleryItems } from "./galleryListSlice";
import { GalleryListViewProps, GalleryModuleSettings } from "./types";
import GalleryListView from "./galleryListView ";

const GalleryListContainer: React.FC<GalleryListViewProps> = ({
  items,
  itemsPerPage = 6,
  onItemClick,
  settings,
  onSettingsUpdate, // 🔁 this is the key fix
  children,
}) => {
  const dispatch = useAppDispatch();
  const galleryItems = useAppSelector(selectGalleryItems);

  const [currentSettings, setCurrentSettings] =
    useState<GalleryModuleSettings>(settings);

  useEffect(() => {
    dispatch(setGalleryItems(items));
  }, [items]);

  const handleSettingsUpdate = (updated: GalleryModuleSettings) => {
    setCurrentSettings(updated);
    if (onSettingsUpdate) {
      onSettingsUpdate(updated); // 🔁 send update back to parent
    }
  };

  return (
    <GalleryListView
      items={galleryItems}
      itemsPerPage={itemsPerPage}
      onItemClick={onItemClick}
      settings={currentSettings}
      onSettingsUpdate={handleSettingsUpdate}
    >
      {children}
    </GalleryListView>
  );
};
export default GalleryListContainer;