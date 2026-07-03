import {
  SkylynxNet_AuthLoginReq,
  SkylynxNet_AuthLoginResponse,
  SkylynxNet_AuthSignUpReq,
  SkylynxNet_AuthSignUpResponse,
  UserProfileResp,
} from "./types";

import {
  SkylynxKey_APIKEY,
  AuthServer_URL,
  SkylynxServer_URL,
} from "../../helpers/constants";

// 🔐 Login
export const signInWithPassword = async ({
  email,
  secret,
}: SkylynxNet_AuthLoginReq): Promise<SkylynxNet_AuthLoginResponse> => {
  const res = await fetch(`${AuthServer_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "skyx-api-key": SkylynxKey_APIKEY,
    },
    body: JSON.stringify({ email, password: secret }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Login failed");
  return data;
};

// 🧾 Signup
export const signUp = async ({
  email,
  secret,
  username,
  profileFields,
}: SkylynxNet_AuthSignUpReq): Promise<SkylynxNet_AuthSignUpResponse> => {
  const response = await fetch(`${AuthServer_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "skyx-api-key": SkylynxKey_APIKEY,
    },
    body: JSON.stringify({
      email,
      password: secret,
      username,
      profileFields,
    }),
  });

  if (!response.ok) {
    throw new Error("Signup failed");
  }

  return response.json();
};

// ================================================
// ✅ Thunk: loadUserProfile
// Description: Fetches extended user profile and stores it in state
// ================================================

export const fetchUserProfile = async (
  token: string
): Promise<UserProfileResp> => {
  const res = await fetch(`${SkylynxServer_URL}/users/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "skyx-api-key": SkylynxKey_APIKEY,
    },
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Failed to load user profile.");
  }

  return res.json();
};