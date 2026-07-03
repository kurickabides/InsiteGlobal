// ================================================
// ✅ Helper: doEncrypt (Browser-safe using crypto-js)
// ================================================

import CryptoJS from "crypto-js";

const secretKey = "dev-skylynx-default-key!12345678901234"; // Must be 32 characters for AES-256

export function encryptData(data: any): string {
  const json = JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(json, secretKey).toString();
  return encrypted;
}

export function decryptData(encryptedData: string): any {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decrypted);
}
 