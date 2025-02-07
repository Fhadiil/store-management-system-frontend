// src/components/StoreManagement.jsx
import { useState, useEffect } from "react";
import api from "../services/api";

const StoreManagement = () => {
  const [stores, setStores] = useState([]);
  const [storeName, setStoreName] = useState("");
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    api.get("/stores/").then((res) => setStores(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await api.put(`/stores/${editing.id}/`, { name: storeName });
      setEditing(null);
    } else {
      await api.post("/stores/", { name: storeName });
    }
    setStoreName("");
    api.get("/stores/").then((res) => setStores(res.data));
  };

  const handleDelete = async (id) => {
    await api.delete(`/stores/${id}/`);
    setStores(stores.filter((store) => store.id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Store Management</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          placeholder="Enter store name"
          className="p-2 border rounded mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {editing ? "Update Store" : "Add Store"}
        </button>
      </form>
      <ul className="bg-white p-4 rounded shadow">
        {stores.map((store) => (
          <li key={store.id} className="flex justify-between p-2 border-b">
            <span>{store.name}</span>
            <div>
              <button
                onClick={() => {
                  setEditing(store);
                  setStoreName(store.name);
                }}
                className="text-blue-500 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(store.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoreManagement;
