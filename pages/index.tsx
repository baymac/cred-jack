import React from 'react';
import CredJack from '../components/CredJack/CredJack';
import CreateUser from '../components/CreateUser/CreateUser';
import HomeLayout from '../layouts/HomeLayout';
import useUser from '../lib/useUser';

export default function Home() {
  const { user } = useUser({ redirectTo: '/login' });
  if (!user?.isLoggedIn) {
    return <p>loading...</p>;
  }

  return (
    <HomeLayout>
      {!user?.existing_user ? <CreateUser /> : <CredJack />}
    </HomeLayout>
  );
}
