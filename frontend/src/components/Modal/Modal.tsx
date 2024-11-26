import React from "react";
import ReactDOM from "react-dom";
import Header from "../Header/Header"; // Adjust the path to your Header component
import { X } from "lucide-react";
import styles from "./Modal.module.scss";

type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  name: string;
};

const Modal: React.FC<Props> = ({ children, isOpen, onClose, name }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={`${styles.modalOverlay} modalOverlayColor`}>
      <div className={`${styles.modalContent} modalContentColor`}>
        <Header
          name={name}
          buttonComponent={
            <button
              className={`${styles.closeButton} closeButtonColor`}
              onClick={onClose}
            >
              <X size={18} />
            </button>
          }
          isSmallText
        />
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
