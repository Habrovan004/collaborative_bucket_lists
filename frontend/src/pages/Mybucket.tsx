import React, { useState, useEffect, ChangeEvent } from "react";
import { currentUser } from "../data/currentUser";

interface BucketItem {
  id: number;
  user: string;
  email: string;
  title: string;
  description: string;
  image?: string;
  likes: number;
  comments: string[];
  completed: boolean;
}

const MyBucket: React.FC = () => {
  const [items, setItems] = useState<BucketItem[]>(() => {
    const saved = localStorage.getItem("myBucketItems");
    return saved ? JSON.parse(saved) : [];
  });
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BucketItem | null>(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [newComments, setNewComments] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    localStorage.setItem("myBucketItems", JSON.stringify(items));
    const allSaved = localStorage.getItem("allBucketItems");
    let allItems: BucketItem[] = allSaved ? JSON.parse(allSaved) : [];
    items.forEach(item => {
      const index = allItems.findIndex(i => i.id === item.id);
      if (index >= 0) allItems[index] = item;
      else allItems.push(item);
    });
    localStorage.setItem("allBucketItems", JSON.stringify(allItems));
  }, [items]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImage(e.target.files[0]);
  };

  const addOrEditItem = () => {
    if (!title || !desc) return alert("Please fill all fields");

    if (editingItem) {
      setItems(items.map(item =>
        item.id === editingItem.id
          ? { ...item, title, description: desc, image: image ? URL.createObjectURL(image) : item.image }
          : item
      ));
      setEditingItem(null);
    } else {
      const newItem: BucketItem = {
        id: Date.now(),
        user: currentUser.name,
        email: currentUser.email,
        title,
        description: desc,
        image: image ? URL.createObjectURL(image) : undefined,
        likes: 0,
        comments: [],
        completed: false,
      };
      setItems([...items, newItem]);
    }

    setOpen(false);
    setTitle("");
    setDesc("");
    setImage(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleToggleComplete = (id: number) => {
    setItems(items.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const handleComment = (id: number) => {
    const comment = newComments[id];
    if (!comment) return;
    setItems(items.map(item => item.id === id ? { ...item, comments: [...item.comments, comment] } : item));
    setNewComments({ ...newComments, [id]: "" });
  };

  const totalItems = items.length;
  const completedItems = items.filter(i => i.completed).length;
  const activeItems = totalItems - completedItems;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-700">My Bucket List</h1>
        <button onClick={() => setOpen(true)} className="bg-purple-600 text-white px-5 py-2 rounded-lg shadow hover:bg-purple-700 transition">
          + Add Item
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <p className="text-gray-400">Total Items</p>
          <h3 className="text-2xl font-bold">{totalItems}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <p className="text-gray-400">Active Items</p>
          <h3 className="text-2xl font-bold">{activeItems}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <p className="text-gray-400">Completed Items</p>
          <h3 className="text-2xl font-bold">{completedItems}</h3>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item.id} className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
            {item.image && <img src={item.image} className="w-full h-48 object-cover rounded-xl mb-3" alt={item.title} />}
            <h2 className={`text-xl font-bold mb-1 ${item.completed ? "line-through text-gray-400" : ""}`}>{item.title}</h2>
            <p className="text-gray-600 mb-2">{item.description}</p>

            <div className="flex gap-2 flex-wrap mb-2">
              <button onClick={() => handleToggleComplete(item.id)} className={`px-2 py-1 rounded ${item.completed ? "bg-yellow-500 text-white hover:bg-yellow-600" : "bg-green-500 text-white hover:bg-green-600"} transition`}>
                {item.completed ? "Mark Active" : "Mark Complete"}
              </button>
              <button onClick={() => { setEditingItem(item); setTitle(item.title); setDesc(item.description); setOpen(true); }} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                Edit
              </button>
              <button onClick={() => handleDelete(item.id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">
                Delete
              </button>
              <button onClick={() => { item.likes += 1; setItems([...items]); }} className="px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
                Like ({item.likes})
              </button>
            </div>

            {/* Comments */}
            <div className="mt-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComments[item.id] || ""}
                onChange={e => setNewComments({ ...newComments, [item.id]: e.target.value })}
                className="w-full border p-2 rounded mb-2 focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <button onClick={() => handleComment(item.id)} className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition">Comment</button>
              <ul className="mt-2 text-gray-600">
                {item.comments.map((c, idx) => <li key={idx} className="text-sm border-b py-1">{c}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl w-96 shadow-xl">
            <h2 className="text-2xl font-bold mb-4">{editingItem ? "Edit Bucket Item" : "Add Bucket Item"}</h2>
            <input type="text" placeholder="Title" className="w-full border p-2 rounded mb-3 focus:ring-2 focus:ring-purple-500 outline-none" value={title} onChange={e => setTitle(e.target.value)} />
            <textarea placeholder="Description" className="w-full border p-2 rounded mb-3 focus:ring-2 focus:ring-purple-500 outline-none" value={desc} onChange={e => setDesc(e.target.value)} />
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full mb-3" />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => { setOpen(false); setEditingItem(null); setTitle(""); setDesc(""); setImage(null); }} className="px-3 py-2 border rounded hover:bg-gray-100 transition">Cancel</button>
              <button onClick={addOrEditItem} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">{editingItem ? "Save Changes" : "Add Item"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBucket;
