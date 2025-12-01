import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface BucketItem {
  id: number;
  title: string;
  description: string;
  image?: string;
  created_at: string;
  completed: boolean;
  notes?: string;
  notesImage?: string;
  user: {
    username: string;
    email: string;
    avatar?: string;
  };
}

const MyBucket: React.FC = () => {
  const [items, setItems] = useState<BucketItem[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  // Load User's Items
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/buckets/")
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err));
  }, [0]);

  // Toggle Completed
  const toggleComplete = async (id: number) => {
    await axios.post(`http://localhost:8000/api/buckets/${id}/toggle-complete/`);
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // Delete
  const handleDelete = async (id: number) => {
    await axios.delete(`http://localhost:8000/api/buckets/${id}/`);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const filteredItems = items.filter((item) => {
    if (filter === "active") return !item.completed;
    if (filter === "completed") return item.completed;
    return true;
  });

  return (
    <div className="w-full">

      {/* Add New Item Button */}
      <div className="flex justify-end mb-6">
        <Link
          to="/add-item"
          className="bg-purple-600 text-white px-5 py-2 rounded-lg shadow hover:bg-purple-700"
        >
          + Add New Item
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-800">My Bucket List</h1>

      {/* Tabs */}
      <div className="flex gap-3 my-6">
        {["all", "active", "completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab as any)}
            className={`px-4 py-2 rounded-full border font-medium ${
              filter === tab
                ? "bg-purple-600 text-white"
                : "bg-white border-gray-300"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Bucket Items */}
      <div className="flex flex-col gap-8">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow border relative">

            {/* Completed Banner */}
            {item.completed && (
              <div className="absolute top-0 w-full bg-green-500 text-white py-1 text-center font-semibold">
                ✓ Completed
              </div>
            )}

            {item.image && (
              <img src={item.image} className="w-full h-56 object-cover" />
            )}

            <div className="p-6">
              <h2 className="text-xl font-bold">{item.title}</h2>
              <p className="text-gray-700">{item.description}</p>

              {/* Actions */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => toggleComplete(item.id)}
                  className="px-3 py-1 rounded bg-green-200"
                >
                  {item.completed ? "Undo" : "Mark Complete"}
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1 rounded bg-red-200"
                >
                  Delete
                </button>

                <Link
                  to={`/edit-item/${item.id}`}
                  className="px-3 py-1 rounded bg-blue-200"
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBucket;
