import styles from "./Spinner.module.scss";
export default function Spinner() {
  return (
    <div className={styles.preloaderOverlay}>
      <div className={styles.spinner}></div>
      {/* <span
    className="spinner-border spinner-border-sm"
    role="status"
    aria-hidden="true"
  ></span> */}
    </div>
  );
}
