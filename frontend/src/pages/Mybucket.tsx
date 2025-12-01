import { useState, useEffect } from 'react';
import { Plus, Trophy, ListTodo, Sparkles } from 'lucide-react';
import { ActivityCard } from './ActivityBucket';
import AddBucketItem from './AddBucketItem';
import { EditActivityModal } from './EditActivity';
import { ShareExperienceModal } from './ShareExperience';
import type { Activity } from './ActivityBucket';
import { API_ENDPOINTS } from "../config/api";

const MyBucket: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [sharingActivity, setSharingActivity] = useState<Activity | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Map backend bucket to frontend Activity
  const mapBucketToActivity = (bucket: any): Activity => {
    let imageUrl: string | undefined = undefined;
    if (bucket.image) {
      if (bucket.image.startsWith('http')) {
        imageUrl = bucket.image;
      } else if (bucket.image.startsWith('/')) {
        imageUrl = `http://localhost:8000${bucket.image}`;
      } else {
        imageUrl = `http://localhost:8000/media/${bucket.image}`;
      }
    }

    return {
      id: String(bucket.id),
      title: bucket.title,
      description: bucket.description || '',
      author: bucket.owner || 'Unknown',
      authorAvatar: undefined,
      createdAt: bucket.created_at,
      imageUrl,
      isCompleted: bucket.is_completed || false,
      isLiked: bucket.has_upvoted || false,
      likes: bucket.upvotes_count || 0,
      comments: (bucket.comments || []).map((comment: any) => ({
        id: String(comment.id),
        author: comment.user || 'Unknown',
        text: comment.text,
        createdAt: comment.created_at,
        authorAvatar: undefined,
      })),
    };
  };

  const fetchMyBuckets = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setError('Please login to view your buckets');
        return;
      }

      const response = await fetch(API_ENDPOINTS.BUCKETS.LIST, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch buckets');
      }

      const data = await response.json();
      const buckets = Array.isArray(data) ? data : (data.results || []);
      // Filter to only show buckets owned by current user
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const myBuckets = buckets.filter((b: any) => b.is_owner || b.owner === user?.username);
      const mappedActivities = myBuckets.map(mapBucketToActivity);
      setActivities(mappedActivities);
    } catch (err: any) {
      console.error('Error fetching buckets:', err);
      setError(err.message || 'Failed to load your buckets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBuckets();
  }, []);

  const filteredActivities = activities.filter(activity => {
    if (filter === 'active') return !activity.isCompleted;
    if (filter === 'completed') return activity.isCompleted;
    return true;
  });

  const completedCount = activities.filter(a => a.isCompleted).length;
  const activeCount = activities.length - completedCount;

  const handleAdd = async (title: string, desc: string, imageFile?: File) => {
    setIsAdding(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Please login');
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', desc);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch(API_ENDPOINTS.BUCKETS.LIST, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        await fetchMyBuckets();
        setIsAddModalOpen(false);
      } else {
        const data = await response.json();
        console.error('Upload error response:', data);
        const errorMsg = data.detail || data.image?.[0] || JSON.stringify(data) || 'Failed to add bucket item';
        alert(errorMsg);
      }
    } catch (err) {
      console.error('Add error:', err);
      alert('Failed to add bucket item');
    } finally {
      setIsAdding(false);
    }
  };

  const handleEdit = async (id: string, title: string, desc: string, img?: string) => {
    setIsEditing(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Please login');
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', desc);

      const response = await fetch(API_ENDPOINTS.BUCKETS.DETAIL(id), {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        await fetchMyBuckets();
        setEditingActivity(null);
      } else {
        const data = await response.json();
        alert(data.detail || 'Failed to update bucket item');
      }
    } catch (err) {
      console.error('Edit error:', err);
      alert('Failed to update bucket item');
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bucket item?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Please login');
        return;
      }

      const response = await fetch(API_ENDPOINTS.BUCKETS.DETAIL(id), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        await fetchMyBuckets();
      } else {
        const data = await response.json();
        alert(data.detail || 'Failed to delete bucket item');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete bucket item');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMarkComplete = async (id: string, note: string, img?: string) => {
    setIsCompleting(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Please login');
        return;
      }

      // First toggle complete
      const toggleResponse = await fetch(API_ENDPOINTS.BUCKETS.TOGGLE_COMPLETE(id), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (toggleResponse.ok) {
        // Update with experience note if provided
        if (note) {
          const formData = new FormData();
          formData.append('description', note);
          await fetch(API_ENDPOINTS.BUCKETS.DETAIL(id), {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
          });
        }
        await fetchMyBuckets();
        setSharingActivity(null);
      } else {
        const data = await toggleResponse.json();
        alert(data.detail || 'Failed to mark as complete');
      }
    } catch (err) {
      console.error('Complete error:', err);
      alert('Failed to mark as complete');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleLike = async (id: string) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Please login to like items');
        return;
      }

      const response = await fetch(API_ENDPOINTS.BUCKETS.UPVOTE(id), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        await fetchMyBuckets();
      } else {
        const data = await response.json();
        alert(data.detail || 'Failed to like');
      }
    } catch (err) {
      console.error('Like error:', err);
      alert('Failed to like item');
    }
  };

  const handleComment = async (id: string, text: string) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Please login to comment');
        return;
      }

      const response = await fetch(API_ENDPOINTS.BUCKETS.COMMENTS(id), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        await fetchMyBuckets();
      } else {
        const data = await response.json();
        alert(data.detail || 'Failed to add comment');
      }
    } catch (err) {
      console.error('Comment error:', err);
      alert('Failed to add comment');
    }
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-3">
            <Sparkles className="w-10 h-10 text-purple-600" />
            My Bucket List
            <Sparkles className="w-10 h-10 text-pink-600" />
          </h1>
          <p className="text-xl text-gray-600">
            Dream big. Live boldly. Celebrate every win.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-purple-100 rounded-2xl">
                <ListTodo className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <p className="text-4xl font-bold text-gray-900">{activities.length}</p>
                <p className="text-gray-600">Total Dreams</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-100 rounded-2xl">
                <ListTodo className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-4xl font-bold text-gray-900">{activeCount}</p>
                <p className="text-gray-600">In Progress</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-green-100 rounded-2xl">
                <Trophy className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-4xl font-bold text-gray-900">{completedCount}</p>
                <p className="text-gray-600">Achieved!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs + Add Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex gap-3">
            {(['all', 'active', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-3 rounded-2xl font-medium transition-all transform hover:scale-105 ${
                  filter === f
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold rounded-2xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <Plus className="w-6 h-6" />
            Add New Dream
          </button>
        </div>

        {/* Activities Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-1">
          {filteredActivities.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                <Trophy className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-3">
                {filter === 'completed' ? "No achievements yet" : "Your list is empty"}
              </h3>
              <p className="text-gray-500 mb-6">
                {filter === 'completed' 
                  ? "When you complete a dream, it'll appear here!" 
                  : "Start by adding your first bucket list item"}
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="text-purple-600 font-bold text-lg hover:text-purple-700"
              >
                + Add Your First Dream
              </button>
            </div>
          ) : (
            filteredActivities.map(activity => (
              <div key={activity.id} className="transform hover:scale-105 transition-all duration-300">
                <ActivityCard
                  activity={activity}
                  onLike={handleLike}
                  onComment={handleComment}
                  showActions={true}
                  isOwner={true}
                  onEdit={() => setEditingActivity(activity)}
                  onDelete={() => handleDelete(activity.id)}
                  onMarkComplete={() => setSharingActivity(activity)}
                />
              </div>
            ))
          )}
        </div>

        {/* Modals */}
        {isAddModalOpen && (
          <AddBucketItem
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAdd={handleAdd}
            isLoading={isAdding}
          />
        )}

        {editingActivity && (
          <EditActivityModal
            activity={editingActivity}
            onClose={() => setEditingActivity(null)}
            onEdit={handleEdit}
            isLoading={isEditing}
          />
        )}

        {sharingActivity && (
          <ShareExperienceModal
            activity={sharingActivity}
            onClose={() => setSharingActivity(null)}
            onShare={handleMarkComplete}
            isLoading={isCompleting}
          />
        )}
      </div>
    </div>
  );
};

export default MyBucket;
