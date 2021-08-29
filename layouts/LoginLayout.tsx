import { useRouter } from 'next/router';
import React from 'react';
import styles from '../styles/pageStyles/login.module.css';

export default function LoginLayout({ children }) {
  const router = useRouter();

  return (
    <div className={styles.center}>
      <div className={styles.container}>{children}</div>
    </div>
  );
}
