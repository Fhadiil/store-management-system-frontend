// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import StoreManagement from "./components/StoreManagement";
import ProductManagement from "./components/ProductManagement";
import SalesProcessing from "./components/SalesProcessing";

const App = () => {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="p-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/stores" element={<StoreManagement />} />
              <Route path="/products" element={<ProductManagement />} />
              <Route path="/sales" element={<SalesProcessing />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
