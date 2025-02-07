// components/ui/Alert.jsx
import React from "react";

const Alert = ({ children, variant = "info", className = "", ...props }) => {
  const variants = {
    info: "bg-blue-50 text-blue-700 border-blue-200",
    success: "bg-green-50 text-green-700 border-green-200",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
    danger: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div
      className={`px-4 py-3 rounded-lg border ${variants[variant]} ${className}`}
      role="alert"
      {...props}
    >
      {children}
    </div>
  );
};

const AlertTitle = ({ children, className = "", ...props }) => (
  <h5 className={`font-medium mb-1 ${className}`} {...props}>
    {children}
  </h5>
);

const AlertDescription = ({ children, className = "", ...props }) => (
  <p className={`text-sm ${className}`} {...props}>
    {children}
  </p>
);

Alert.Title = AlertTitle;
Alert.Description = AlertDescription;

export { Alert };
