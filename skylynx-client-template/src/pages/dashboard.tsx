// ================================================
// ✅ Page: Dashboard
// Description: Displays user's portals as a gallery using GalleryListContainer
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: pages/Dashboard.tsx
// ================================================

import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../hooks/reduxHooks";
import { selectAuth } from "../components/auth/authSlice";
import { Helmet } from "react-helmet";
import { APP_TITLE, PAGE_TITLE_DASHBOARD } from "../helpers/constants";

import GalleryListContainer from "../modules/galleryListView/GalleryListContainer";
import {
  GalleryItem,
  GalleryModuleSettings,
} from "../modules/galleryListView/types";
import { fetchUserPortals } from "../modules/galleryListView/galleryListApi";
import { IPortal } from "../entities/portal";

import {
  setGalleryItems,
  selectGalleryItems,
} from "../modules/galleryListView/galleryListSlice";

import EDPDFModuleContainer from "../modules/edPDFModule/edPDFModuleContainer";
import { EDPDFModuleSettings } from "../modules/edPDFModule/types";

import MapMapModule from "../modules/merginMapMapModule/merginMapMapModule";
import { MapMapModuleSettings } from "../modules/merginMapMapModule/types";

import ESRIMapModuleContainer from "../modules/esriMapModule/esriMapModuleContainer";
import { ESRIMapModuleSettings } from "../modules/esriMapModule/types";
import { BasemapType } from "../components/esri/types";

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector(selectAuth);
  const galleryItems = useAppSelector(selectGalleryItems);

  const [settings, setSettings] = useState<GalleryModuleSettings>({
    title: "Portals",
    showTitle: true,
    showDescription: true,
    layoutVariant: "grid",
    height: 600,
  });

 const [pdfSettings, setPdfSettings] = useState<EDPDFModuleSettings>({
   title: "Engineering Markup Preview",
   showTitle: true,
   layoutVariant: "pdf",
   pdfPath: "/content/Orlando_Part1.pdf",
   showToolbar: true,
   enablePhotoOverlay: true,
   enableFormAnnotations: true,
   enableZoom: true,
   enablePan: true,
   defaultZoomLevel: 1.25,
   persistViewport: true,
   drawingScale: "1:500",
   enableDynamicScale: true,
   showScaleIndicator: true,
   showRulerOverlay: true,
   defaultTool: "drawRect",
   markupColor: "#FF0000",
   highlightOnHover: true,
   snapToGrid: false,
   enablePageNav: true,
   autoSaveInterval: 60,
   markupDataSourceID: "DATASET-MARKUP-001",
   height: 600,
 });


 const [esriLocationSettings, setESRIViewSettings] = useState<ESRIMapModuleSettings>({
   title: "ESRI Base Map Viewer",
   showTitle: true,
   center: [-122.6765, 45.5231], // Portland, OR
   zoom: 15,
   basemap: BasemapType.Streets,
   height: 500,
   showScaleBar: true,
   enableDraw: false,
   showLegend: true,
   showLayerList: true,
   layerVisibility: {},
 });

  useEffect(() => {
    const loadPortals = async () => {
      if (!authState?.token) return;

      try {
        const userId: string = authState.user.profile.userID;
        const portals: IPortal[] = await fetchUserPortals({
          userID: userId,
          token: authState.token,
        });

        const mapped: GalleryItem[] = portals.map((p: IPortal) => ({
          id: p.PortalID,
          label: p.PortalName,
          description: `Status: [${p.Status}] ${p.Description ?? ""}`,
          splashImage: p.SplashImage ?? "default.png",
        }));

        dispatch(setGalleryItems(mapped));
      } catch (err: any) {
        console.error("❌ Failed to load user portals:", err.message);
      }
    };

    loadPortals();
  }, [authState.user, authState.token, dispatch]);

  const handlePortalClick = (portalId: string) => {
    console.log("📦 Clicked Portal:", portalId);
  };

  const handleSettingsUpdate = (updated: GalleryModuleSettings) => {
    setSettings(updated);
  };
  const handlePDfSettingsUpdate = (updated: EDPDFModuleSettings) => {
    setPdfSettings(updated);
  };

const handleESRIViewSettingsUpdate = (updated: ESRIMapModuleSettings) => {
  setESRIViewSettings(updated);
};


  return (
    <>
      <Helmet>
        <title>{`${PAGE_TITLE_DASHBOARD} | ${APP_TITLE}`}</title>
      </Helmet>

      <GalleryListContainer
        settings={settings}
        onSettingsUpdate={handleSettingsUpdate}
        items={galleryItems}
        onItemClick={handlePortalClick}
      />

      <EDPDFModuleContainer
        settings={pdfSettings}
        onSettingsUpdate={handlePDfSettingsUpdate}
      />

      <ESRIMapModuleContainer
        settings={esriLocationSettings}
        onSettingsUpdate={handleESRIViewSettingsUpdate}
      />
    </>
  );
};

export default Dashboard;
