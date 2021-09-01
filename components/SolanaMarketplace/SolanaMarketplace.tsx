import styles from './solanamarketplace.module.css';
import rootStyles from '../../styles/root.module.css';
import cn from 'classnames';

export default function SolanaMarketplace() {
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
        <>Yet to be implemented</>
      </div>
    </section>
  );
}
