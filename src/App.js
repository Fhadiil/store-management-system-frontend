// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StoreDashboard from "./components/StoreDashboard";
import StoreManagement from "./components/StoreManagement";
import ProductManagement from "./components/ProductManagement";
import SalesProcessing from "./components/SalesProcessing";
import Layout from "./components/Sidebar";

const App = () => {
  return (
    <Router>
      <Layout>
        <div className="flex h-screen bg-gray-100">
          {/* <Sidebar /> */}
          <div className="flex-1 flex flex-col">
            {/* <Header /> */}
            <main className="p-4">
              <Routes>
                <Route path="/" element={<StoreDashboard />} />
                <Route path="/dashboard" element={<StoreDashboard />} />
                <Route path="/stores" element={<StoreManagement />} />
                <Route path="/products" element={<ProductManagement />} />
                <Route path="/sales" element={<SalesProcessing />} />
              </Routes>
            </main>
          </div>
        </div>
      </Layout>
    </Router>
  );
};

export default App;
