// ================================================
// ✅ API: galleryListApi
// Description: API utilities for loading Gallery items (e.g. portals)
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: /modules/galleryListView/galleryListApi.ts
// ================================================

import { GalleryItem } from "./types";
import { SkylynxKey_APIKEY, SkylynxServer_URL } from "../../helpers/constants";
import { IPortal } from "../../entities/portal";

export const fetchUserPortals = async ({
  userID,
  token,
}: {
  userID: string;
  token: string;
}): Promise<IPortal[]> => {
  const res = await fetch(`${SkylynxServer_URL}/portals/byuser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // ✅ Fixed template string
      "skyx-api-key": SkylynxKey_APIKEY,
    },
    body: JSON.stringify({ userID }), // ✅ Sends correct body
  });
  console.log("UserID Key:", userID);
   console.log("API Key:", SkylynxKey_APIKEY);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || "Failed to fetch user portals");
  }

  const data = await res.json();
  return data.portals;
};
