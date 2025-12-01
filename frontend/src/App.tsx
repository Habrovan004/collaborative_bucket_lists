import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

import Discover from './pages/Discover';
import MyBucket from './pages/Mybucket';
import AddBucketItem from './pages/AddBucketItem';

function App() {
  return (
    <Router>
      <Routes>

        {/* Public route */}
        <Route path="/auth" element={<Auth />} />

        {/* Dashboard with nested pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard/discover" replace />} />
          <Route path="discover" element={<Discover />} />
          <Route path="my-bucket" element={<MyBucket />} />
        </Route>

        {/* Add Item - Independent Page */}
        <Route
          path="/add-item"
          element={
            <ProtectedRoute>
              <AddBucketItem />
            </ProtectedRoute>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Redirect root */}
        <Route path="/" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
