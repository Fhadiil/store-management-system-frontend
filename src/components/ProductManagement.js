import { useState, useEffect } from "react";
import api from "../services/api";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  PackagePlus,
  Filter,
  RefreshCw,
  ArrowUpDown,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/Dialog";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Label } from "./ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/Table";
import { Alert, AlertDescription, AlertTitle } from "./ui/Alert";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock_quantity: "",
    barcode: "",
    store_id: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockUpdate, setStockUpdate] = useState({ quantity: "", type: "add" });
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedStore, setSelectedStore] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, products, selectedStore]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, storesRes] = await Promise.all([
        api.get("/products/"),
        api.get("/stores/"),
      ]);
      console.log("Fetched Products:", productsRes.data);
      setProducts(productsRes.data);
      setFilteredProducts(productsRes.data);
      setStores(storesRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.barcode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Store filter
    if (selectedStore && selectedStore !== "all") {
      filtered = filtered.filter(
        (product) => product.store?.id === selectedStore
      );
    }

    setFilteredProducts(filtered);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredProducts].sort((a, b) => {
      if (direction === "asc") {
        return a[key] > b[key] ? 1 : -1;
      }
      return a[key] < b[key] ? 1 : -1;
    });
    setFilteredProducts(sorted);
  };

  const handleStockUpdate = async (productId) => {
    try {
      const quantity =
        stockUpdate.type === "remove"
          ? -Math.abs(Number(stockUpdate.quantity))
          : Math.abs(Number(stockUpdate.quantity));

      await api.patch(`/products/${productId}/update_stock/`, {
        quantity_change: quantity,
      });

      await fetchData();
      setIsStockModalOpen(false);
      setStockUpdate({ quantity: "", type: "add" });
    } catch (error) {
      console.error("Failed to update stock:", error);
    }
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.store_id) {
      alert("Please select a store.");
      return;
    }

    const dataToSend = {
      ...formData,
      price: Number(formData.price),
      stock_quantity: Number(formData.stock_quantity),
      store_id: Number(formData.store_id), // Ensure store_id is a valid number
    };

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}/`, dataToSend);
      } else {
        await api.post("/products/", dataToSend);
      }
      alert("Product saved successfully");
      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save product:", error.response?.data || error);
      alert("Error adding product. Check console for details.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}/`);
        fetchData();
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      stock_quantity: product.stock_quantity,
      barcode: product.barcode,
      store_id: product.store ? product.store.id : "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      price: "",
      stock_quantity: "",
      barcode: "",
      store_id: "",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Product Management
          </h2>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="w-full md:w-64">
                <Select value={selectedStore} onValueChange={setSelectedStore}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by store" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stores</SelectItem>
                    {stores.map((store) => (
                      <SelectItem key={store.id} value={store.id}>
                        {store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedStore("");
                }}
                className="whitespace-nowrap"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    onClick={() => handleSort("name")}
                    className="cursor-pointer"
                  >
                    Name <ArrowUpDown className="inline h-4 w-4 ml-1" />
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("price")}
                    className="cursor-pointer"
                  >
                    Price <ArrowUpDown className="inline h-4 w-4 ml-1" />
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("stock_quantity")}
                    className="cursor-pointer"
                  >
                    Stock <ArrowUpDown className="inline h-4 w-4 ml-1" />
                  </TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Store</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading products...
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>₦{product.price}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            product.stock_quantity <= 10
                              ? "bg-red-100 text-red-800"
                              : product.stock_quantity <= 20
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {product.stock_quantity}
                        </span>
                      </TableCell>
                      <TableCell>{product.barcode}</TableCell>
                      <TableCell>{product.store?.name || "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingProduct(product);
                              setIsStockModalOpen(true);
                            }}
                          >
                            <PackagePlus className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Product Form Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Label>Product Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />

            <Label>Price</Label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value)}
              required
            />

            <Label>Stock Quantity</Label>
            <Input
              type="number"
              value={formData.stock_quantity}
              onChange={(e) => handleChange("stock_quantity", e.target.value)}
              required
            />

            <Label>Barcode</Label>
            <Input
              value={formData.barcode}
              onChange={(e) => handleChange("barcode", e.target.value)}
              required
            />

            <Label>Store</Label>
            <Select
              value={formData.store_id}
              onValueChange={(value) => handleChange("store_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select store" />
              </SelectTrigger>
              <SelectContent>
                {stores.map((store) => (
                  <SelectItem key={store.id} value={store.id.toString()}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button type="submit">
              {editingProduct ? "Save Changes" : "Add Product"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Stock Update Modal */}
      <Dialog open={isStockModalOpen} onOpenChange={setIsStockModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Stock</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select
              value={stockUpdate.type}
              onValueChange={(value) =>
                setStockUpdate((prev) => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select operation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">Add Stock</SelectItem>
                <SelectItem value="remove">Remove Stock</SelectItem>
              </SelectContent>
            </Select>

            <div>
              <Label>Quantity</Label>
              <Input
                type="number"
                value={stockUpdate.quantity}
                onChange={(e) =>
                  setStockUpdate((prev) => ({
                    ...prev,
                    quantity: e.target.value,
                  }))
                }
                min="1"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => handleStockUpdate(editingProduct.id)}
              disabled={!stockUpdate.quantity}
            >
              Update Stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;
