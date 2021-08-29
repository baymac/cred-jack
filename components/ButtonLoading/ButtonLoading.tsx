import styles from './buttonloading.module.css';

export default function ButtonLoading() {
  return (
    <div className={styles.squareHolder}>
      <div className={styles.square}></div>
    </div>
  );
}
