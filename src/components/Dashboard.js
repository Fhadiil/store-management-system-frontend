// src/components/Dashboard.jsx
import { useState, useEffect } from "react";
import api from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    stores: 0,
    products: 0,
    sales: 0,
    revenue: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const [stores, products, sales] = await Promise.all([
        api.get("/stores/"),
        api.get("/products/"),
        api.get("/sales/"),
      ]);

      const totalRevenue = sales.data.reduce(
        (sum, sale) => sum + parseFloat(sale.total_price),
        0
      );

      setStats({
        stores: stores.data.length,
        products: products.data.length,
        sales: sales.data.length,
        revenue: totalRevenue,
      });
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-500 text-white p-4 rounded-lg">
          Stores: {stats.stores}
        </div>
        <div className="bg-green-500 text-white p-4 rounded-lg">
          Products: {stats.products}
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded-lg">
          Sales: {stats.sales}
        </div>
        <div className="bg-red-500 text-white p-4 rounded-lg">
          Revenue: ₦{stats.revenue}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
