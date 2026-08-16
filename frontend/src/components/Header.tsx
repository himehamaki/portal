import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-primary">社内ポータル</h1>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="サイト内を検索..."
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-danger text-white rounded hover:bg-red-600 text-sm"
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
