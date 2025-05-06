// components/reports/InventoryReport.jsx
import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { AlertCircle, Package, Download } from "lucide-react";

const InventoryReport = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [threshold, setThreshold] = useState(10);

  const fetchInventoryReport = async () => {
    setLoading(true);
    try {
      const response = await api.get("/reports/inventory/", {
        params: { threshold },
      });
      setInventoryData(response.data);
    } catch (error) {
      console.error("Error fetching inventory report:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryReport();
  }, [threshold]);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Inventory Report</h3>
        <div className="flex items-center gap-2">
          <label className="text-sm">Low Stock Threshold:</label>
          <input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(parseInt(e.target.value))}
            className="border rounded w-16 px-2 py-1 text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <p>Loading inventory data...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {inventoryData.length > 0 ? (
            <>
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-red-700">
                    {inventoryData.length} product
                    {inventoryData.length !== 1 ? "s" : ""} below threshold
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Barcode
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Stock
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inventoryData.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.barcode}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              item.stock_quantity <= 5
                                ? "bg-red-100 text-red-800"
                                : item.stock_quantity <= 10
                                ? "bg-yellow-100 text-yellow-800"
                                : ""
                            }`}
                          >
                            {item.stock_quantity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <Package className="h-12 w-12 mb-2" />
              <p>No low stock items found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InventoryReport;
