import cn from 'classnames';
import rootStyles from '../../styles/root.module.css';
import styles from './userinfo.module.css';

export default function UserInfo() {
  return (
    <section
      className={cn(rootStyles.section, styles.about__section)}
      id="userInfo"
    >
      <div
        className={cn(
          rootStyles.container,
          rootStyles.grid,
          styles.about__container
        )}
      >
        {JSON.stringify(1)}
      </div>
    </section>
  );
}
