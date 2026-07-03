//These Interfaces are used to connect to the Rabit Wallet from Stellar
import {
  FB_AuthLoginResponse,
  LoginProviders,
} from "./types/index";

export interface Rabit_ConnectResult {
  publicKey: string;
  error?: string;
}

//This is the interface of using MetaMask as
export interface Meta_AuthLoginReq {
    address: string;

}


//Add WINAuth to use SQL server


//ICP Auth - we will the ablity to use ICP auth instead of our core auth if needed


export interface MetaMask_AuthLoginResponse {
  addressKey: string;
  refreshToken: string, //A hasKey Auth refresh token for the authenticated user.
  expiresIn: string, //The number of seconds in which the ID token expires
  localId: string, //The rio wallet address of user.
  registered: boolean 
}
export interface MetaMask_ConnectResponse {
  addressKey: string;
}
//Stored Token Interface
export interface AuthTokenStore
{
    storedToken:string,
    remainingTime:number
}
export interface AuthLogInReq {
  email: string;
  secret: string;
}



//used with metamask provider 
//export interface AuthMetamaskLogInReq {
  
//}

export type walletProviders = "Stellar" | "MetaMask";



//This replaced the Auth context
export type AuthTokenState = {
  token: string;
  isLoggedIn: boolean;
  remainingTime: number;
  isAuthLoading: boolean;
  provider: LoginProviders;
};

//Context for auth Tokens
export type AuthTokenContext = {
  token: string;
  isLoggedIn: boolean;
  login: (token: string, expiresIn: number) => void;
  Logout: () => void;
  LogoutTimer: NodeJS.Timeout;
};

export type AuthFireBaseProvider = {
    Login: (emailaddress: string, password: string) => Promise<void>;
    CreateNewAccount: (emailaddress: string, password: string) => Promise<void>;
};