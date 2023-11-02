import React from "react";

interface ErrorModalProps {
  show: boolean;
  onClose: () => void;
  textError: string;
}

export const ErrorModal: React.FC<ErrorModalProps> = (props) => {
  const {
    show,
    onClose,
    textError,
  } = props;

  if (!show) {
    return null;
  }

  const handleBackgroundOverlayClickClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="error-modal"
      onClick={handleBackgroundOverlayClickClose}
    >
      <div className="error-modal-content">
        <p>{textError}</p>
        <button
          type='button'
          onClick={onClose}
          className='btn btn-success btn-sm'
        >
          Закрыть
        </button>
      </div>
    </div>
  );
};
