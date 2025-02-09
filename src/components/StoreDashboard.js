import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  Package,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Calendar,
} from "lucide-react";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const StoreDashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [netProfit, setNetProfit] = useState(0);
  const [growthRate, setGrowthRate] = useState(0);
  // const [startDate, setStartDate] = useState(new Date());
  // const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/dashboard");
      console.log(response.data);

      // Fix the key names to match the API response
      setSalesData(response.data.salesData || []);
      setTopProducts(response.data.top_products || []); // Fix here
      setTotalProducts(response.data.total_products || 0);
      setTotalSales(response.data.total_sales || 0);
      setNetProfit(response.data.total_revenue || 0);
      setGrowthRate(response.data.growth_rate || 0);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Store Dashboard</h2>
        <div className="flex items-center gap-4">
          {/* <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className="border p-2 rounded"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            className="border p-2 rounded"
          /> */}
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Package}
          title="Total Products"
          value={totalProducts}
          trend={12}
          trendUp
        />
        <StatCard
          icon={ShoppingCart}
          title="Total Sales"
          value={`₦${totalSales}`}
          trend={8.2}
          trendUp
        />
        <StatCard
          icon={DollarSign}
          title="Net Profit"
          value={`₦${netProfit}`}
          trend={3.1}
          trendUp={false}
        />
        <StatCard
          icon={TrendingUp}
          title="Growth Rate"
          value={`${growthRate}%`}
          trend={5.4}
          trendUp
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Sales Overview">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#4F46E5" />
              <Line type="monotone" dataKey="profit" stroke="#10B981" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Product Performance">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#4F46E5" />
              <Bar dataKey="revenue" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Top Performing Products</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topProducts.length > 0 ? (
                topProducts.map((product, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.product__name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.total_sold}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">N/A</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap" colSpan="3">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, trend, trendUp }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-gray-100 rounded-lg">
        <Icon className="h-6 w-6 text-gray-600" />
      </div>
      <span
        className={`text-sm flex items-center ${
          trendUp ? "text-green-600" : "text-red-600"
        }`}
      >
        {trendUp ? (
          <ArrowUpRight className="h-4 w-4 mr-1" />
        ) : (
          <ArrowDownRight className="h-4 w-4 mr-1" />
        )}
        {trend}%
      </span>
    </div>
    <h3 className="text-2xl font-bold mb-1">{value}</h3>
    <p className="text-gray-600 text-sm">{title}</p>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

export default StoreDashboard;
