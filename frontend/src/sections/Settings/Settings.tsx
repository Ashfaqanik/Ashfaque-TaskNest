import Header from "../../components/Header/Header";
import styles from "./Settings.module.scss";
import { useAppSelector } from "../../store/redux";

const Settings = () => {
  const userSettings = {
    username: "johndoe",
    email: "john.doe@example.com",
    teamName: "Development Team",
    roleName: "Developer",
  };
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  return (
    <div className={styles.settingsContainer}>
      <Header name="Settings" />
      <div className={styles.formContainer}>
        <div>
          <label
            className={`${styles.labelStyle} ${isDarkMode ? styles.dark : ""}`}
          >
            Username
          </label>
          <div className={`${styles.input} ${isDarkMode ? styles.dark : ""}`}>
            {userSettings.username}
          </div>
        </div>
        <div>
          <label
            className={`${styles.labelStyle} ${isDarkMode ? styles.dark : ""}`}
          >
            Email
          </label>
          <div className={`${styles.input} ${isDarkMode ? styles.dark : ""}`}>
            {userSettings.email}
          </div>
        </div>
        <div>
          <label
            className={`${styles.labelStyle} ${isDarkMode ? styles.dark : ""}`}
          >
            Team
          </label>
          <div className={`${styles.input} ${isDarkMode ? styles.dark : ""}`}>
            {userSettings.teamName}
          </div>
        </div>
        <div>
          <label
            className={`${styles.labelStyle} ${isDarkMode ? styles.dark : ""}`}
          >
            Role
          </label>
          <div className={`${styles.input} ${isDarkMode ? styles.dark : ""}`}>
            {userSettings.roleName}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
