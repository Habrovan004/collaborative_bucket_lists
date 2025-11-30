import { FC, useEffect, useState } from 'react';

interface UserStats {
  bucketItems: number;
  completed: number;
  activeGoals: number;
}

interface ProfileStatsProps {
  userId: string;
}

const ProfileStats: FC<ProfileStatsProps> = ({ userId }) => {
  const [stats, setStats] = useState<UserStats>({
    bucketItems: 0,
    completed: 0,
    activeGoals: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/profile/stats/${userId}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex gap-10 mt-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="text-center">
            <div className="h-7 bg-gray-200 rounded w-8 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-10 mt-6">
      <div className="text-center">
        <p className="text-2xl font-bold">{stats.bucketItems}</p>
        <p className="text-gray-500 text-sm">Bucket List Items</p>
      </div>

      <div className="text-center">
        <p className="text-2xl font-bold">{stats.completed}</p>
        <p className="text-gray-500 text-sm">Completed</p>
      </div>

      <div className="text-center">
        <p className="text-2xl font-bold">{stats.activeGoals}</p>
        <p className="text-gray-500 text-sm">Active Goals</p>
      </div>
    </div>
  );
};

export default ProfileStats;