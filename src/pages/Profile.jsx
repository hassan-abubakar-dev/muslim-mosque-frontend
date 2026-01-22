import { useState } from 'react';
import Header from '../components/Header';

const Profile = () => {
  // Mock data
  const [user] = useState({
    firstName: 'Hassan',
    surName: 'Abubakar',
    email: 'hassan@example.com',
    gender: 'male',
    role: 'admin', // added role
    joined: '2026-01-15',
    avatar: 'https://i.pravatar.cc/150?img=12',
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-20">

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 mt-10">
        <div className="flex flex-col items-center">
          <img
            src={user.avatar}
            alt={user.firstName}
            className="w-32 h-32 rounded-full object-cover border-4 border-emerald-700"
          />
          <h1 className="text-2xl font-semibold text-emerald-800 mt-4">{user.firstName} {user.surName}</h1>
          <p className="text-gray-600 mt-1">{user.email}</p>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Gender:</span>
            <span className="text-gray-600">{user.gender}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700 italic">Role:</span>
            <span className="text-gray-600 bg-emerald-100">{user.role}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Joined:</span>
            <span className="text-gray-600">{user.joined}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button className="px-6 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-800">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
