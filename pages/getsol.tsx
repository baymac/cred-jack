import Link from 'next/link';
import React from 'react';
import AddWallet from '../components/AddWallet/AddWallet';
import SolanaMarketplace from '../components/SolanaMarketplace/SolanaMarketplace';
import HomeLayout from '../layouts/HomeLayout';
import useUser from '../lib/useUser';

export default function Getsol() {
  const { user } = useUser({ redirectTo: '/login' });

  return (
    <HomeLayout>
      {user?.sol_addr && <SolanaMarketplace />}
      {user && !user.sol_addr && <AddWallet />}
      {!user?.existing_user && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          First register yourself&nbsp;
          <Link href="/">
            <a>here</a>
          </Link>
        </div>
      )}
    </HomeLayout>
  );
}
