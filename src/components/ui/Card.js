import React from "react";

const Card = ({ children, className = "", ...props }) => (
  <div
    className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}
    {...props}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className = "", ...props }) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "", ...props }) => (
  <h3 className={`text-xl font-semibold text-gray-900 ${className}`} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = "", ...props }) => (
  <p className={`text-sm text-gray-500 mt-1 ${className}`} {...props}>
    {children}
  </p>
);

const CardContent = ({ children, className = "", ...props }) => (
  <div className={`px-6 py-4 ${className}`} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = "", ...props }) => (
  <div className={`px-6 py-4 border-t border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

// ✅ Export components separately
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
