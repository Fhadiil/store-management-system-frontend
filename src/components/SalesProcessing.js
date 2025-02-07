import React, { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
} from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/Table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/Dialog";
import api from "../services/api";

const SalesManagement = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [store, setStore] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [productsResponse, storeResponse] = await Promise.all([
          api.get("/products/"),
          api.get("/stores/"),
        ]);
        setProducts(productsResponse.data);
        setStore(storeResponse.data[0]); // Assuming first store
      } catch (error) {
        console.error("Failed to fetch initial data", error);
      }
    };

    fetchInitialData();
  }, []);

  const handleSearch = () => {
    const results = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode.includes(searchTerm)
    );
    setSearchResults(results);
    setIsProductModalOpen(true);
  };

  const addToCart = (product) => {
    const existingCartItem = cart.find((item) => item.id === product.id);

    if (existingCartItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity }]);
    }

    setIsProductModalOpen(false);
    setSearchTerm("");
    setQuantity(1);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity > 0) {
      setCart(
        cart.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const processCheckout = async () => {
    try {
      const salesPromises = cart.map((item) =>
        api.post("/sale/", {
          product: item.id,
          quantity: item.quantity,
          total_price: item.price * item.quantity,
        })
      );

      await Promise.all(salesPromises);
      generateReceipt();
      setCart([]);
    } catch (error) {
      console.error("Checkout failed", error);
    }
  };

  const generateReceipt = () => {
    const receiptWindow = window.open("", "Receipt", "width=600,height=800");
    receiptWindow.document.write(`
      <html>
        <head>
          <title>Sales Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          </style>
        </head>
        <body>
          <h1>${store.name} - Sales Receipt</h1>
          <p>Date: ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${cart
                .map(
                  (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>₦${item.price}</td>
                  <td>₦${item.price * item.quantity}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3">Total</td>
                <td>₦${calculateTotal()}</td>
              </tr>
            </tfoot>
          </table>
        </body>
      </html>
    `);
    receiptWindow.document.close();
    receiptWindow.print();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex space-x-4">
        <div className="flex-grow">
          <Input
            placeholder="Search by product name or barcode"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch}>
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </div>

      {/* Cart Section */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <h2 className="text-2xl font-bold mb-4">Cart</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>₦{item.price}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>₦{item.price * item.quantity}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Checkout Section */}
        <div className="bg-white border rounded-lg p-4 space-y-4">
          <h3 className="text-xl font-semibold">Checkout</h3>
          <div className="flex justify-between">
            <span>Total Items:</span>
            <span>
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total Amount:</span>
            <span>₦{calculateTotal()}</span>
          </div>
          <Button
            className="w-full"
            disabled={cart.length === 0}
            onClick={processCheckout}
          >
            <ShoppingCart className="mr-2 h-4 w-4" /> Process Sale
          </Button>
        </div>
      </div>

      {/* Product Search Modal */}
      <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Select Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.barcode}</TableCell>
                    <TableCell>₦{product.price}</TableCell>
                    <TableCell>{product.stock_quantity}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedProduct(product);
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" /> Select
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {selectedProduct && (
              <div className="flex items-center space-x-4">
                <span>Quantity:</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span>{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                >
                  Add to Cart
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesManagement;
