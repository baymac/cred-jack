import cn from 'classnames';
import React, { useState } from 'react';
import fetchJson from '../../lib/fetchJson';
import useUser from '../../lib/useUser';
import { getAccountFromLocalStorage } from '../../lib/utils';
import ButtonLoading from '../ButtonLoading/ButtonLoading';
import styles from './addwallet.module.css';

export default function AddWallet() {
  const { user, mutateUser } = useUser();

  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    const account = getAccountFromLocalStorage('paymentKey');
    mutateUser(
      await fetchJson('/api/addSolWallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: user.phone,
          sol_addr: Buffer.from(account.secretKey).toString('base64'),
        }),
      })
    );
    setLoading(false);
  };

  return (
    <>
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
    </>
  );
}
