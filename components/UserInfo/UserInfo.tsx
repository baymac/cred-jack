import cn from 'classnames';
import useUser from '../../lib/useUser';
import rootStyles from '../../styles/root.module.css';
import styles from './userinfo.module.css';

export default function UserInfo() {
  const { user } = useUser();

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
        <div className={styles.item_wrapper}>
          <div className={styles.item}>
            <p>
              <b>Name:</b> {user.first_name} {user.last_name}
            </p>
          </div>
          <div className={styles.item}>
            <p>
              <b>Phone:</b> {user.phone}
            </p>
          </div>
          <div className={styles.item}>
            <p>
              <b>Email:</b> {user.email}
            </p>
          </div>
          <div className={styles.item}>
            <p>
              <b>Solana Address:</b> {user.sol_addr}
            </p>
          </div>
          <div className={styles.item}>
            <p>
              <b>Cred Coins Balance:</b> {user.coins}
            </p>
          </div>
          <div className={styles.item}>
            <p>
              <b>Trust Score:</b> {user.trust_score}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
