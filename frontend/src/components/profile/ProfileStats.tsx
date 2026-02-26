import { FC } from 'react';

interface Stats {
  bucketItems: number;
  completed: number;
  activeGoals: number;
}

interface ProfileStatsProps {
  stats: Stats;
}

const ProfileStats: FC<ProfileStatsProps> = ({ stats }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h2 className="text-lg font-bold mb-4">Bucket List Stats</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.bucketItems}</div>
          <div className="text-gray-500 text-sm">Total Items</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-gray-500 text-sm">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.activeGoals}</div>
          <div className="text-gray-500 text-sm">Active</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;