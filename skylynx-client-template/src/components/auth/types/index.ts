// types.ts


export type LoginProviders = "SkylynxNet" | "Google" | "GITHUB" | "AD";

export interface SkylynxNet_AuthLoginReq {
  email: string;
  secret: string;
}

export interface SkylynxNet_AuthSignUpReq {
  email: string;
  secret: string;
  username?: string;
  profileFields?: UserProfileField[]; // ✅ Optional and supported by server
}

export interface UserProfileResp {
  profile: SkylynxNet_UserProfile;
}

export interface SkylynxNet_AuthSignUpResponse {
  message: string;
  userId: string;
  email: string;
}

export interface SkylynxNet_AuthLoginResponse {
  message: string;
  token: string;
  roles: string[];
}


// Profile and Role Support Types
export interface UserRole {
  name: string;
}

// ✅ Used in sign-up and updates (creation only requires ID and value)
// Server-persisted
export interface ProfileField {
  FieldProviderID: string;
  FieldTypeID: string;
  FieldID: string;
  FieldValue: string;
}


// ✅ Used when displaying user data (includes field label)
// UI-level
export type UserProfileField = {
  FieldProviderID: string; // Links the field to a given provider (e.g., Portal/User profile)
  FieldID: string; // Unique field identifier
  FieldValue: string; // Current value
  FieldName: string; // Label shown in form
  FieldType: // Data type used for input rendering and validation
  | "Text"
    | "Phone"
    | "Email"
    | "Date"
    | "Boolean"
    | "Number"
    | "Link"
    | "Select";
  Required?: boolean; // Optional: is field required
  Options?: Array<{
    // Only used for Select dropdowns
    key: string;
    value: string;
  }>;
};


export type ProfileFields = ProfileField[];

// Detailed User Profile
// ================================================
// ✅ Entity: SkylynxNet_UserProfile
// Description: Canonical user profile model returned by SkylynxNet API
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename:entities/user/skylynxUserProfile.ts
// ================================================

export interface SkylynxNet_UserProfile {
  userID: string;
  username: string;
  email: string;
  emailConfirmed: boolean;
  phoneNumber?: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  accessFailedCount: number;

  portalId: string;
  portalName: string;
  portalDescription?: string;
  portalCreatedDate: string;

  providerId: string;

  firstName?: string;
  lastName?: string;
  photo?: string;
  mobilePhone?: string;
  dateOfBirth?: string;
  preferredLanguage?: string;

  addressId?: string;
  mailingAddress1?: string;
  mailingAddress2?: string;
  city?: string;
  stateProvinceId?: string;
  zip?: string;

  billingAddressId?: string;
  billingAddress1?: string;
  billingAddress2?: string;
  billingCity?: string;
  billingZip?: string;
  billingStateProvinceId?: string;

  createdAt: string;
  updatedAt: string;
}


export interface SkylynxNet_SignUpSettings {
  userProviderId: string;
  getUsername: boolean;
  getEmail: string;
  confirmEmail: boolean;
  phoneNumber?: string;
  confirmPhoneNumber: boolean;
  enableTwoFactor: boolean;
  getUserProfilePersonalInfo: boolean;
  getUserProfileAdressVMInfo: boolean;
  getUserProfileBillingVMInfo: boolean;
}

export interface SkylynxNet_PasswordResetResponse {
  email: string;
  requestType: string;
}

export interface SkylynxNet_LoggedINUser {
  id: string;
  roles: string[];
  profile: SkylynxNet_UserProfile;
}

export interface SkylynxNet_GetUserResponse {
  id: string;
  email: string;
  roles: string[];
  profile: SkylynxNet_UserProfile;
}

export interface AuthTokenStore {
  storedToken: string;
  remainingTime: number;
}


export type Skylynxnet_AuthProvider = {
  Login: (
    email: string,
    password: string
  ) => Promise<{ token: string; roles: string[] }>;
  CreateNewAccount: (email: string, password: string) => Promise<void>;
  ResetPassword: (email: string) => Promise<void>;
};

export type AuthTokenState = {
  token: string;
  isLoggedIn: boolean;
  remainingTime: number;
  isAuthLoading: boolean;
  provider: LoginProviders;
  user: SkylynxNet_LoggedINUser;
  error: string;
};
