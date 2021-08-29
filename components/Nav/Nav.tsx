import {
  UilApps,
  UilArrowLeft,
  UilMoon,
  UilMultiply,
  UilSun,
} from '@iconscout/react-unicons';
import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { createElement, useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContextProvider';
import rootStyles from '../../styles/root.module.css';
import styles from './nav.module.css';
import NavLinkMobile from './NavLinkMobile';
import NavLinkBigScreen from './NavLinkBigScreen';
import { useTheme } from 'next-themes';
import Logo from '../Logo/Logo';

export default function Nav() {
  const { navBarOpen, setNavBarOpen } = useAppContext();

  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  // After mounting, we have access to the theme
  useEffect(() => setMounted(true), []);

  const router = useRouter();

  return (
    <>
      <header className={styles.header}>
        <nav className={cn(styles.nav, rootStyles.container)}>
          {!router.pathname.startsWith('/posts') && (
            <Link href="/" passHref>
              <button
                className={styles.nav__logo_button}
                aria-label="logo-button"
              >
                <div className={styles.nav__logo}>
                  <Logo />
                </div>
              </button>
            </Link>
          )}
          {router.pathname.startsWith('/posts') && (
            <Link href={`/blog`} passHref>
              <button
                className={styles.nav__logo_button}
                aria-label="back-button"
              >
                <div className={styles.nav__logo}>
                  <UilArrowLeft />
                </div>
              </button>
            </Link>
          )}
          <NavLinkBigScreen />
          <div className={styles.nav__btns}>
            {mounted &&
              createElement(
                'button',
                {
                  className: cn(styles.nav__changeTheme),
                  onClick: () =>
                    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
                  'aria-label': 'change-theme-button',
                },
                createElement(
                  resolvedTheme === 'dark' ? UilSun : UilMoon,
                  {
                    id: 'theme-button',
                    width: 28,
                    height: 28,
                  },
                  null
                )
              )}
            {!mounted && (
              <div className={styles.skeleton_loader_container}>
                {createElement(
                  'div',
                  {
                    className: cn(styles.skeleton_loader),
                  },
                  null
                )}
              </div>
            )}
            {!navBarOpen && (
              <button
                onClick={() => setNavBarOpen(true)}
                className={styles.nav__toggle}
                aria-label="nav-open-button"
              >
                <UilApps id="nav_toggle" width={28} height={28} />
              </button>
            )}
            {navBarOpen && (
              <button
                className={styles.nav__toggle}
                onClick={() => setNavBarOpen(false)}
                aria-label="nav-close-button"
              >
                <UilMultiply width={28} height={28} id="nav_toggle" />
              </button>
            )}
          </div>
        </nav>
      </header>
      <NavLinkMobile />
    </>
  );
}
