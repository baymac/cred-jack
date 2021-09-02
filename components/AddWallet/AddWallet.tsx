import cn from 'classnames';
import React, { useState } from 'react';
import fetchJson from '../../lib/fetchJson';
import useUser from '../../lib/useUser';
import { getLocalStorageKeypair } from '../../lib/utils';
import ButtonLoading from '../ButtonLoading/ButtonLoading';
import styles from './addwallet.module.css';

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
    // <section className={cn(rootStyles.section)} id="userInfo">
    //   <div className={cn(rootStyles.container, styles.about__container)}>
    //     {!user?.sol_addr && <p>No wallet found</p>}
    //     <div
    //       className={cn(styles.input_box, {
    //         [styles.button_disable]: loading,
    //       })}
    //     >
    //       <button
    //         type="submit"
    //         disabled={loading}
    //         onClick={() => {
    //           handleAdd();
    //         }}
    //       >
    //         {loading ? <ButtonLoading /> : 'Add Wallet'}
    //       </button>
    //     </div>
    //   </div>
    // </section>
    <>
      {/* {!user?.sol_addr && <p>No wallet found</p>} */}
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
