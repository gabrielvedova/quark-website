import styles from "./ConfirmationPopup.module.css";

interface ConfirmationPopupProps {
  confirmationPopup: {
    message: string;
    onConfirm: () => Promise<void>;
  };
  setConfirmationPopup: (
    confirmationPopup: {
      message: string;
      onConfirm: () => Promise<void>;
    } | null
  ) => void;
  confirmationPopupRef: React.RefObject<HTMLDivElement>;
}

export default function ConfirmationPopup(props: ConfirmationPopupProps) {
  const { confirmationPopup, setConfirmationPopup, confirmationPopupRef } =
    props;

  return (
    <div className={styles.popupBackground} ref={confirmationPopupRef}>
      <div className={styles.confirmationPopup}>
        <p className={styles.confirmationMessage}>
          {confirmationPopup.message}
        </p>
        <div className={styles.confirmationButtons}>
          <button
            className={styles.cancelBtn}
            onClick={(e) => {
              e.preventDefault();
              setConfirmationPopup(null);
            }}
          >
            Cancelar
          </button>
          <button
            className={styles.confirmationBtn}
            onClick={async (e) => {
              e.preventDefault();
              await confirmationPopup.onConfirm();
              setConfirmationPopup(null);
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
