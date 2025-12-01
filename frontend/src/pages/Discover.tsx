import React, { useEffect, useState } from "react";
import axios from "axios";

interface DiscoverItem {
  id: number;
  title: string;
  description: string;
  image?: string;
  likes: number;
  comments: string[];
  user: { username: string; avatar?: string };
}

const Discover: React.FC = () => {
  const [items, setItems] = useState<DiscoverItem[]>([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/buckets/")
      .then((res) => setItems(res.data))
      .catch((err) => console.log(err));
  }, []);

  const likeItem = async (id: number) => {
    await axios.post(`http://localhost:8000/api/buckets/${id}/like/`);
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, likes: i.likes + 1 } : i
      )
    );
  };

  const commentItem = async (id: number) => {
    await axios.post(`http://localhost:8000/api/buckets/${id}/comment/`, {
      text: comment,
    });

    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, comments: [...i.comments, comment] } : i
      )
    );

    setComment("");
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Discover</h1>

      <div className="flex flex-col gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-xl shadow">

            <h2 className="font-bold text-xl">{item.title}</h2>
            <p>{item.description}</p>

            {item.image && (
              <img src={item.image} className="w-full h-56 object-cover my-3" />
            )}

            <div className="flex justify-between">
              <button
                onClick={() => likeItem(item.id)}
                className="bg-red-200 px-3 py-1 rounded"
              >
                ❤️ {item.likes}
              </button>
            </div>

            {/* Comments */}
            <div className="mt-3">
              <h3 className="font-semibold">Comments</h3>

              {item.comments.map((c, i) => (
                <p key={i} className="text-gray-700 text-sm">
                  • {c}
                </p>
              ))}

              <div className="flex mt-2">
                <input
                  className="border p-2 flex-grow rounded-l"
                  placeholder="Add comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  onClick={() => commentItem(item.id)}
                  className="bg-purple-600 text-white px-4 rounded-r"
                >
                  Send
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Discover;
