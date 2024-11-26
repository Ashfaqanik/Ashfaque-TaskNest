import React from "react";
import styles from "./Header.module.scss";

type Props = {
  name: string;
  buttonComponent?: React.ReactNode;
  isSmallText?: boolean;
};

const Header: React.FC<Props> = ({
  name,
  buttonComponent,
  isSmallText = false,
}) => {
  return (
    <div className={styles.headerContainer}>
      <h1
        className={`${styles.headerTitle} ${
          isSmallText ? styles.smallText : styles.largeText
        }`}
      >
        {name}
      </h1>
      {buttonComponent}
    </div>
  );
};

export default Header;
