import React from "react";
import Modal from "./Modal";
import ErrorPage from "./ErrorPage";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  errorCode?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
  size?: "sm" | "md" | "lg";
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  title = "Erreur",
  message,
  errorCode,
  icon,
  action,
  backgroundColor,
  textColor,
  size = "sm",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size={size}>
      <ErrorPage
        title={title}
        message={message}
        errorCode={errorCode}
        icon={icon}
        backgroundColor={backgroundColor}
        textColor={textColor}
        action={action}
      />
    </Modal>
  );
};

export default ErrorModal; 