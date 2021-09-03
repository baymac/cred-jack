import { Account, Connection } from '@solana/web3.js';

export interface IGenericAPIResponse {
  error: boolean;
  message: string;
}

export const getAccountFromLocalStorage = (key: string): Account => {
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

export const getConnection = (): { connection: Connection } => {
  const rpcUrl = 'https://api.devnet.solana.com';
  const url = new URL(rpcUrl).toString();
  return { connection: new Connection(url, 'confirmed') };
};

export const sleep = (duration: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({ error: false, message: `Slept for ${duration}` });
    }, duration);
  });

export const getBalance = async (pubKey, skipDelay = false) => {
  if (!skipDelay) {
    await sleep(2000);
  }
  const { connection } = getConnection();
  return await connection.getBalance(pubKey);
};

export const requestAirDrops = async (connection, account, amount) => {
  const signature = await connection.requestAirdrop(account.publicKey, amount);
  await connection.confirmTransaction(signature);
};
