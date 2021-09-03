import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function useNavSelection() {
  const [selectedMenu, setSelectedMenu] = useState('home');
  const router = useRouter();

  useEffect(() => {
    if (router.asPath === '/') {
      setSelectedMenu('home');
    } else {
      setSelectedMenu('login');
    }
  }, [router]);

  return [selectedMenu];
}
