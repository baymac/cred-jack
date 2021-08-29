import styles from './navlink.module.css';
import NavbarLinks from './NavbarLinks';
import cn from 'classnames';

export default function NavLinkBigScreen() {
  return (
    <div className={styles.nav__menu_bigscreen_wrapper}>
      <div className={cn(styles.nav__menu)}>
        <NavbarLinks />
      </div>
    </div>
  );
}
