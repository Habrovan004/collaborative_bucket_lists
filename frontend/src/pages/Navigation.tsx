import { Compass, ListChecks, User } from 'lucide-react';


interface NavigationProps {
  currentView: 'discover' | 'mybucket' | 'profile';
  onViewChange: (view: 'discover' | 'mybucket' | 'profile') => void;
  userProfile: UserProfile;
}

export function Navigation({ currentView, onViewChange, userProfile }: NavigationProps) {
  const navItems = [
    { id: 'discover' as const, label: 'Discover', icon: Compass },
    { id: 'mybucket' as const, label: 'My Bucket', icon: ListChecks },
    { id: 'profile' as const, label: 'Profile', icon: User }
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg">
      <div className="p-6">
        {/* Logo/Header */}
        <div className="mb-8">
          <h2 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Bucket List
          </h2>
          <p className="text-xs text-gray-500 mt-1">Your adventure awaits</p>
        </div>

        {/* User Info */}
        <div className="mb-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
          <div className="flex items-center gap-3">
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">{userProfile.name}</p>
              <p className="text-xs text-gray-500 truncate">{userProfile.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
