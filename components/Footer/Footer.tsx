import { UilGithub } from '@iconscout/react-unicons';
import cn from 'classnames';
import Link from 'next/link';
import rootStyles from '../../styles/root.module.css';
import footerStyles from './footer.module.css';

export default function Footer() {
  return (
    <footer className={footerStyles.footer}>
      <div className={footerStyles.footer__bg}>
        <div
          className={cn(
            rootStyles.grid,
            rootStyles.container,
            footerStyles.footer__container
          )}
        >
          <ul className={footerStyles.footer__links_1}>
            <li>
              <Link href="/">
                <a className={footerStyles.footer__link}>Home</a>
              </Link>
            </li>
          </ul>
          <ul className={footerStyles.footer__links_2}>
            <li>
              <Link href="/about">
                <a className={footerStyles.footer__link}>About</a>
              </Link>
            </li>
          </ul>
          <div className={footerStyles.footer__social}>
            <a
              href="https://github.com/baymac/cred-coin"
              target="_blank"
              rel="noreferrer"
              className={cn(
                footerStyles.footer__social_icon,
                footerStyles.footer__social_icon_gh
              )}
              aria-label="github"
            >
              <UilGithub alt="github" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
