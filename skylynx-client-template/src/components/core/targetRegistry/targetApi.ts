// ================================================
// ✅ API: fetchTargetMeta
// Description: Loads target metadata using GET and API key header
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: components/core/targetRegistry/targetApi.ts
// ================================================

import axios from "axios";
import {
  SkylynxServer_TemplatesURL,
  SkylynxKey_APIKEY,
} from "../../../helpers/constants";
import {SkylynxDataModel } from "../types";
export async function fetchTargetMeta(
  targetType: string,
  targetID: string
): Promise<SkylynxDataModel> {
  const url = `${SkylynxServer_TemplatesURL}${targetType}/${targetID}`;

  const response = await axios.get<SkylynxDataModel>(url, {
    headers: {
      "skyx-api-key": SkylynxKey_APIKEY,
    },
  });

  return response.data;
}
