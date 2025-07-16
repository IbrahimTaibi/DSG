import React from "react";

interface ErrorPageProps {
  message: string;
  title?: string;
  errorCode?: string;
  icon?: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
  action?: React.ReactNode;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ message, title, errorCode, icon, backgroundColor, textColor, action }) => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh]"
      style={{ background: backgroundColor, color: textColor }}
    >
      {icon && <div className="mb-2">{icon}</div>}
      {errorCode && <div className="text-5xl font-bold text-red-500 mb-2">{errorCode}</div>}
      {title && <h1 className="text-3xl font-bold mb-2">{title}</h1>}
      <p className="text-lg text-gray-600 mb-4">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default ErrorPage;
