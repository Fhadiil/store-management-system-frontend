import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Store,
  Package,
  ShoppingCart,
  BarChart3,
  LogOut,
  Menu,
  X,
  Building2,
  Users,
} from "lucide-react";
import { Button } from "./ui/Button";

const Logo = () => (
  <div className="flex items-center gap-2 px-2">
    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
      <Building2 className="w-6 h-6 text-primary-foreground" />
    </div>
    <div className="flex flex-col">
      <span className="font-bold text-lg leading-none">StoreHub</span>
      <span className="text-xs text-muted-foreground">Management Portal</span>
    </div>
  </div>
);

// Layout wrapper component
const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return children;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <main className="flex-1 md:ml-72">
        {/* Top mobile header with menu button */}
        <div className="h-16 flex items-center border-b md:hidden px-4">
          <Button
            variant="ghost"
            size="icon"
            className="mr-4"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <Logo />
        </div>
        {/* Main content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, isAdmin, user } = useAuth();

  // Admin navigation
  const adminLinks = [
    {
      to: "/dashboard",
      icon: <BarChart3 className="w-5 h-5" />,
      label: "Dashboard",
      description: "Overview & Analytics",
    },
    {
      to: "/stores",
      icon: <Store className="w-5 h-5" />,
      label: "Stores",
      description: "Manage Locations",
    },
    {
      to: "/products",
      icon: <Package className="w-5 h-5" />,
      label: "Products",
      description: "Inventory Control",
    },
    {
      to: "/sales",
      icon: <ShoppingCart className="w-5 h-5" />,
      label: "Sales",
      description: "Orders & Revenue",
    },
    {
      to: "/users",
      icon: <Users className="w-5 h-5" />,
      label: "Users",
      description: "Manage Sales Staff",
    },
  ];

  // Sales person navigation (only sales)
  const salesLinks = [
    {
      to: "/sales",
      icon: <ShoppingCart className="w-5 h-5" />,
      label: "Sales",
      description: "Make Sales",
    },
  ];

  const links = isAdmin ? adminLinks : salesLinks;

  const sidebarClasses = `
    fixed top-0 left-0 z-40 h-screen bg-background border-r
    transition-transform duration-300 ease-in-out
    w-72 transform md:translate-x-0
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
  `;

  const linkClasses = (isActive) => `
    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
    hover:bg-accent hover:text-accent-foreground
    ${isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"}
  `;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={sidebarClasses}>
        <div className="flex flex-col h-full">
          {/* Header with Logo - Hidden on mobile as it's in the top bar */}
          <div className="h-16 hidden md:flex items-center border-b px-4">
            <Logo />
          </div>

          {/* User Info */}
          <div className="px-4 py-3 border-b">
            <p className="text-xs text-muted-foreground">Logged in as:</p>
            <p className="font-medium text-sm capitalize">{user?.username}</p>
            <p className="text-xs text-muted-foreground capitalize mt-1">
              {user?.role === "admin" ? "Administrator" : "Sales Person"}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex-1 py-6 px-3">
            <nav className="space-y-2">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={linkClasses(location.pathname === link.to)}
                >
                  <div className="flex items-center justify-center w-10">
                    {link.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium leading-none">
                      {link.label}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {link.description}
                    </span>
                  </div>
                </Link>
              ))}
            </nav>
          </div>

          {/* Footer with Logout */}
          <div className="border-t p-4">
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-2" />
              <span className="font-medium">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
