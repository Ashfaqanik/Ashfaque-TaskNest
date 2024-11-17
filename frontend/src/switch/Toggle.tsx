import styles from "./Toggle.module.scss";

interface ToggleProps {
  isNightMode: boolean;
  toggleMode: () => void;
}

export default function Toggle({ isNightMode, toggleMode }: ToggleProps) {
  return (
    <div
      className={`${styles.toggle} ${isNightMode ? styles.night : ""}`}
      onClick={toggleMode}
    >
      <div className={`${styles.notch} ${isNightMode ? styles.night : ""}`}>
        <div className={styles.child}></div>
        <div className={styles.child}></div>
      </div>
      <div
        className={`${styles.shape} ${styles.sm} ${
          isNightMode ? styles.night : ""
        }`}
      ></div>
      <div
        className={`${styles.shape} ${styles.md} ${
          isNightMode ? styles.night : ""
        }`}
      ></div>
      <div
        className={`${styles.shape} ${styles.lg} ${
          isNightMode ? styles.night : ""
        }`}
      ></div>
    </div>
  );
}
