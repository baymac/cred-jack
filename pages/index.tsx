import React from 'react';
import CreateUser from '../components/CreateUser/CreateUser';
import UserInfo from '../components/UserInfo/UserInfo';
import HomeLayout from '../layouts/HomeLayout';
import useUser from '../lib/useUser';

export default function Home() {
  const { user } = useUser({ redirectTo: '/login' });
  if (!user?.isLoggedIn) {
    return <p>loading...</p>;
  }

  return (
    <HomeLayout>
      {!user?.existing_user && <CreateUser />}
      {user?.existing_user && <UserInfo />}
    </HomeLayout>
  );
}
