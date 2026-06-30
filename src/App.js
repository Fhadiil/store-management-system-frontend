// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Sidebar";
import LoginPage from "./pages/LoginPage";
import StoreDashboard from "./components/StoreDashboard";
import StoreManagement from "./components/StoreManagement";
import ProductManagement from "./components/ProductManagement";
import SalesProcessing from "./components/SalesProcessing";
import UserManagement from "./components/UserManagement";

const DefaultRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user?.role === "sales_person") {
    return <Navigate to="/sales" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Login route - no layout */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes with layout */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    {/* Admin routes */}
                    <Route
                      path="dashboard"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <StoreDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="stores"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <StoreManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="products"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <ProductManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="users"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <UserManagement />
                        </ProtectedRoute>
                      }
                    />

                    {/* Sales route - available to both admin and sales person */}
                    <Route path="sales" element={<SalesProcessing />} />

                    {/* Default route chooses path by auth role */}
                    <Route path="" element={<DefaultRedirect />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
