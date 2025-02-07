import { Link, useLocation } from "react-router-dom";
import {
  FaStore,
  FaBox,
  FaShoppingCart,
  FaChartBar,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const links = [
    { to: "/dashboard", icon: <FaChartBar />, label: "Dashboard" },
    { to: "/stores", icon: <FaStore />, label: "Stores" },
    { to: "/products", icon: <FaBox />, label: "Products" },
    { to: "/sales", icon: <FaShoppingCart />, label: "Sales" },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-5 flex flex-col">
      <h2 className="text-2xl font-bold mb-6 text-center">Store Manager</h2>
      <nav className="flex-1">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 p-3 rounded-lg mb-2 hover:bg-gray-700 transition ${
              location.pathname === link.to ? "bg-gray-700" : ""
            }`}
          >
            {link.icon} {link.label}
          </Link>
        ))}
      </nav>
      <button className="flex items-center gap-3 p-3 rounded-lg bg-red-600 hover:bg-red-700">
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
};

export default Sidebar;
