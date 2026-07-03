import { PlaidAccountInfo } from "../providers/plaidModels";
export interface BankAccount {
    userID:string
    bankId: String
    bankName: String
    accountId: String
    mask: String
    name: String
    achAccountNumber: String
    achAccountID: String
    routing: String
    wire: String
}
export const BankAccountProviders= ["Plaid" , "Stellar" , "RIO"]
export type BankAccountState = {
  isLoaded: boolean;
  provider: string;
  providerToken:string
  bankInfo?: PlaidAccountInfo;
};
