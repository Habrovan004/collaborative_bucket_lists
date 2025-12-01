import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Loader2 } from "lucide-react";
import { API_ENDPOINTS } from "../config/api";

interface AddBucketItemProps {
  isOpen?: boolean;
  onClose?: () => void;
  onAdd?: (title: string, description: string, imageFile?: File) => Promise<void>;
  isLoading?: boolean;
}

const AddBucketItem: React.FC<AddBucketItemProps> = ({ 
  isOpen, 
  onClose, 
  onAdd,
  isLoading: externalLoading 
}) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const isModal = isOpen !== undefined;
  const isLoading = externalLoading || loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Title and description are required");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Please login first");
      if (!isModal) navigate("/auth");
      return;
    }

    try {
      setLoading(true);

      // If onAdd callback is provided (modal mode), use it
      if (onAdd) {
        await onAdd(title, description, image || undefined);
        // Reset form
        setTitle("");
        setDescription("");
        setImage(null);
        return;
      }

      // Otherwise, handle directly (page mode)
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (image) formData.append("image", image);

      const response = await fetch(API_ENDPOINTS.BUCKETS.LIST, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          // Don't set Content-Type for FormData, browser will set it with boundary
        },
        body: formData,
      });

      if (response.ok) {
        navigate("/dashboard/my-bucket");
      } else {
        const data = await response.json();
        console.error('Upload error response:', data);
        const errorMsg = data.detail || data.image?.[0] || JSON.stringify(data) || "Failed to add item";
        alert(errorMsg);
      }
    } catch (err: any) {
      console.error("Add failed:", err);
      alert(err.message || "Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-gray-700 font-semibold mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Skydive in Dubai"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          placeholder="Why do you want to do this?"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-2">Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full text-gray-600"
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-4">
        {isModal && onClose && (
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-60"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className={`${isModal ? 'flex-1' : 'w-full'} bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transition disabled:opacity-70 flex items-center justify-center gap-2`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Adding...
            </>
          ) : (
            "Add to Bucket List"
          )}
        </button>
      </div>
    </form>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">Add New Bucket Item</h2>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-3 hover:bg-gray-100 rounded-full transition-all hover:scale-110 disabled:opacity-50"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          <div className="p-6">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg p-8 rounded-2xl mt-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Bucket Item</h1>
      {content}
    </div>
  );
};

export default AddBucketItem;
