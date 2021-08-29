import styles from './navlink.module.css';
import NavbarLinks from './NavbarLinks';
import { useAppContext } from '../../context/AppContextProvider';
import cn from 'classnames';
import usePreventScroll from '../../hooks/usePreventScroll';

export default function NavLinkMobile() {
  const { navBarOpen } = useAppContext();

  usePreventScroll(navBarOpen);

  return (
    <div className={styles.nav__mobile_menu_wrapper}>
      <div
        className={cn(styles.nav__menu, {
          [styles.nav__mobile_menu]: navBarOpen,
          [styles.nav__menu_hidden]: !navBarOpen,
        })}
      >
        <NavbarLinks />
      </div>
    </div>
  );
}
