import styles from './addwallet.module.css';
import rootStyles from '../../styles/root.module.css';
import cn from 'classnames';
import useUser from '../../lib/useUser';
import React, { useState } from 'react';
import ButtonLoading from '../ButtonLoading/ButtonLoading';
import { Account } from '@solana/web3.js';
import fetchJson from '../../lib/fetchJson';

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

export default function AddWallet() {
  const { user, mutateUser } = useUser();

  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    getLocalStorageKeypair('paymentKey');
    mutateUser(
      await fetchJson('/api/addSolWallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: user.phone,
          sol_addr: window.localStorage.getItem('paymentKey'),
        }),
      })
    );
    setLoading(false);
  };

  return (
    <section className={cn(rootStyles.section)} id="userInfo">
      <div className={cn(rootStyles.container, styles.about__container)}>
        {!user?.sol_addr && <p>No wallet found</p>}
        <div
          className={cn(styles.input_box, {
            [styles.button_disable]: loading,
          })}
        >
          <button
            type="submit"
            disabled={loading}
            onClick={() => {
              handleAdd();
            }}
          >
            {loading ? <ButtonLoading /> : 'Add Wallet'}
          </button>
        </div>
      </div>
    </section>
  );
}
