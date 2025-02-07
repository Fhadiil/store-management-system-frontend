// src/components/Header.jsx
import { Bell, UserCircle } from "lucide-react";

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md">
      <h1 className="text-xl font-semibold">Store Management</h1>
      <div className="flex items-center space-x-4">
        <Bell className="w-6 h-6 cursor-pointer text-gray-600" />
        <UserCircle className="w-8 h-8 cursor-pointer text-gray-600" />
      </div>
    </header>
  );
};

export default Header;
