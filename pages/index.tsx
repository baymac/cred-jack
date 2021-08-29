import HomeLayout from '../layouts/HomeLayout';
import useUser from '../lib/useUser';

export default function Home() {
  const { user } = useUser({ redirectTo: '/login' });
  if (!user?.isLoggedIn) {
    return <p>loading...</p>;
  }
  return <HomeLayout>Hello</HomeLayout>;
}
