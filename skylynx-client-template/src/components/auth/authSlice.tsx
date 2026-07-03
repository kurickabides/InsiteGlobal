import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../appStore/store";
  import { normalizeKeys } from "../../services/utils/formatText";
import {
  SkylynxNet_AuthLoginReq,
  SkylynxNet_AuthLoginResponse,
  SkylynxNet_AuthSignUpReq,
  SkylynxNet_AuthSignUpResponse,
  AuthTokenState,
  SkylynxNet_LoggedINUser,
  SkylynxNet_UserProfile,
  UserProfileResp,
} from "./types";

import * as authApi from "./authAPI";


const emptyProfile: SkylynxNet_UserProfile = {
  UserID: "",
  username: "",
  email: "",
  emailConfirmed: false,
  phoneNumberConfirmed: false,
  twoFactorEnabled: false,
  accessFailedCount: 0,
  portalId: "",
  portalName: "",
  portalCreatedDate: "",
  providerId: "",
  createdAt: "",
  updatedAt: "",
  phoneNumber: "",
  portalDescription: "",
  firstName: "",
  lastName: "",
  photo: "",
  mobilePhone: "",
  dateOfBirth: "",
  preferredLanguage: "",
  addressId: "",
  mailingAddress1: "",
  mailingAddress2: "",
  city: "",
  stateProvinceId: "",
  zip: "",
  billingAddressId: "",
  billingAddress1: "",
  billingAddress2: "",
  billingCity: "",
  billingZip: "",
  billingStateProvinceId: "",
};

const userLoggedIN: SkylynxNet_LoggedINUser = {
  id: "",
  roles: [],
  profile: emptyProfile,
};

const fallbackState: AuthTokenState = {
  token: "",
  isLoggedIn: false,
  remainingTime: 0,
  isAuthLoading: false,
  provider: "SkylynxNet",
  user: userLoggedIN,
  error: "",
};

const initialState: AuthTokenState =  fallbackState;

// 🔐 Combined login + profile thunk
export const loginAndLoadProfile = createAsyncThunk<
  { token: string; roles: string[]; profile: SkylynxNet_UserProfile },
  SkylynxNet_AuthLoginReq,
  { state: RootState }
>("auth/loginAndLoadProfile", async (credentials, thunkAPI) => {
  try {
    const loginResponse = await authApi.signInWithPassword(credentials);
    const token = loginResponse.token;

    if (!token) throw new Error("Login failed — no token");

    const profileResp = await authApi.fetchUserProfile(token);

    return {
      token,
      roles: loginResponse.roles || [],
      profile: profileResp.profile,
    };
  } catch (err: any) {
    return thunkAPI.rejectWithValue("Failed to login and load profile");
  }
});

// 🧾 Optional legacy login
export const login = createAsyncThunk<
  SkylynxNet_AuthLoginResponse,
  SkylynxNet_AuthLoginReq,
  { state: RootState }
>("auth/login", async (credentials, thunkAPI) => {
  try {
    return await authApi.signInWithPassword(credentials);
  } catch {
    return thunkAPI.rejectWithValue("Login failed");
  }
});

export const signup = createAsyncThunk<
  SkylynxNet_AuthSignUpResponse,
  SkylynxNet_AuthSignUpReq,
  { state: RootState }
>("auth/signup", async (credentials, thunkAPI) => {
  try {
    return await authApi.signUp(credentials);
  } catch {
    return thunkAPI.rejectWithValue("Signup failed");
  }
});

export const fetchUserProfile = createAsyncThunk<
  UserProfileResp,
  string,
  { state: RootState }
>("auth/fetchUserProfile", async (token, thunkAPI) => {
  try {
    return await authApi.fetchUserProfile(token);
  } catch {
    return thunkAPI.rejectWithValue("Failed to fetch user profile.");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = "";
      state.isLoggedIn = false;
      state.user = userLoggedIN;
      state.isAuthLoading = false;
      state.error = "";
        },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAndLoadProfile.pending, (state) => {
        state.isAuthLoading = true;
      })
      .addCase(loginAndLoadProfile.fulfilled, (state, action) => {
        const { token, roles, profile } = action.payload;
        //we need to do this is match our interfaces
        const normalizedProfile = normalizeKeys<SkylynxNet_UserProfile>(profile);
        state.token = token;
        state.isLoggedIn = true;
        state.isAuthLoading = false;
        state.error = "";
        state.user = {
          id: normalizedProfile.UserID,
          roles: roles || [],
          profile: normalizedProfile,
        };
        state.remainingTime = 60 * 60 * 1000;

      
      })
      .addCase(loginAndLoadProfile.rejected, (state, action) => {
        state.isAuthLoading = false;
        state.isLoggedIn = false;
        state.error = (action.payload as string) || "Login + Profile failed";
      })

      // Legacy login and signup fallbacks
      .addCase(login.pending, (state) => {
        state.isAuthLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {  
        const { token, roles } = action.payload;
        state.isAuthLoading = false;

        if (token) {
          state.token = token;
          state.isLoggedIn = true;
          state.error = "";
          state.user = {
            id: "",
            roles: roles || [],
            profile: emptyProfile,
          };
          state.remainingTime = 60 * 60 * 1000;
          
        } else {
          state.error = "Login did not return a token";
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuthLoading = false;
        state.isLoggedIn = false;
        state.error = (action.payload as string) || "Login failed";
      })
      .addCase(signup.pending, (state) => {
        state.isAuthLoading = true;
      })
      .addCase(signup.fulfilled, (state) => {
        state.isAuthLoading = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isAuthLoading = false;
        state.isLoggedIn = false;
        state.error = (action.payload as string) || "Signup failed";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user.id = action.payload.profile.UserID;
        state.user.profile = action.payload.profile;
        state.remainingTime = 60 * 60 * 1000;
         console.log(
           `📛 fetchUserProfile-AuthState User.isLoggedIn:${state.isLoggedIn} User Object ${state.user.profile} `
         );
        
      });
  },
});

export const authActions = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
