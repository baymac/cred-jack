import { Account } from '@solana/web3.js';

export interface IGenericAPIResponse {
  error: boolean;
  message: string;
}

export const getLocalStorageKeypair = (key: string): Account => {
  const base64Keypair = window.localStorage.getItem(key);
  if (base64Keypair) {
    return new Account(Buffer.from(base64Keypair, 'base64'));
  } else {
    const account = new Account();
    window.localStorage.setItem(
      key,
      Buffer.from(account.secretKey).toString('base64')
    );
    return account;
  }
  // const keypair = Keypair.generate();
  // window.localStorage.setItem(
  //   key,
  //   Buffer.from(keypair.secretKey).toString('base64')
  // );
};
