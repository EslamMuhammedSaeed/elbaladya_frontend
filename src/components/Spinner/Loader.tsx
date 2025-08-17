import styles from "./Spinner.module.scss";
export default function Loader() {
  return (
    <div className={styles.spinnerWrapper}>
      <div className={styles.spinner}></div>
    </div>
  );
}
