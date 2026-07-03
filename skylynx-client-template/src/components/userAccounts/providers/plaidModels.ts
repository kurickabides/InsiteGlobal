import React from "react";
import { PlaidInstitution, PlaidAccount,PlaidLinkOnSuccess} from "./types";
export type PlaidBankAccountBalance = {
  available: number;
  current: number;
  iso_currency_code: String;
  limit: String;
  unofficial_currency_code: String;
};

export type PlaidAccountInfo = {
  usePlaid: boolean;
  bankInfo?: PlaidInstitution;
  bankAccount?: PlaidAccount;
  achPaymetInfo?: PlaidLinkOnSuccess;
  accountBalanceInfo?: PlaidBankAccountBalance;
};
