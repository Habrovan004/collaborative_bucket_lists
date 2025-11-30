import React, { useState, useEffect } from "react";

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

const loadAllItems = (): BucketItem[] => {
  const saved = localStorage.getItem("allBucketItems");
  return saved ? JSON.parse(saved) : [];
};

const saveAllItems = (items: BucketItem[]) => {
  localStorage.setItem("allBucketItems", JSON.stringify(items));
};

const Discover: React.FC = () => {
  const [items, setItems] = useState<BucketItem[]>(() => loadAllItems());
  const [newComments, setNewComments] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    saveAllItems(items);
  }, [items]);

  const handleLike = (id: number) => {
    setItems(items.map(i => i.id === id ? { ...i, likes: i.likes + 1 } : i));
  };

  const handleComment = (id: number) => {
    const comment = newComments[id];
    if (!comment) return;
    setItems(items.map(i => i.id === id ? { ...i, comments: [...i.comments, comment] } : i));
    setNewComments({ ...newComments, [id]: "" });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Discover</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item.id} className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
            {item.image && <img src={item.image} className="w-full h-48 object-cover rounded-xl mb-3" alt={item.title} />}
            <h2 className={`text-xl font-bold mb-1 ${item.completed ? "line-through text-gray-400" : ""}`}>{item.title}</h2>
            <p className="text-gray-600 mb-1">{item.description}</p>
            <p className="text-xs text-gray-400 mb-2">By: {item.user} ({item.email})</p>

            <div className="flex gap-2 flex-wrap mb-2">
              <button onClick={() => handleLike(item.id)} className="px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
                Like ({item.likes})
              </button>
            </div>

            <div className="mt-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComments[item.id] || ""}
                onChange={e => setNewComments({ ...newComments, [item.id]: e.target.value })}
                className="w-full border p-2 rounded mb-2 focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <button onClick={() => handleComment(item.id)} className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
                Comment
              </button>

              <ul className="mt-2 text-gray-600">
                {item.comments.map((c, idx) => <li key={idx} className="text-sm border-b py-1">{c}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discover;
