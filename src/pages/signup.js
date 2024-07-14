import PetKeeper from '@/components/PetKeeper';
import PetParrent from '@/components/PetParrent';
import React, { useState } from 'react';
import 'tailwindcss/tailwind.css'; // Ensure Tailwind CSS is imported

const Signup = () => {
  const [activeTab, setActiveTab] = useState('PetKeeper');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col  min-h-screen py-2 bg-gray-100">
      <div className="w-full ">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <button
              onClick={() => handleTabClick('PetKeeper')}
              className={`py-2 px-4 rounded-lg ${activeTab === 'PetKeeper' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              PetKeeper
            </button>
            <button
              onClick={() => handleTabClick('PetParent')}
              className={`py-2 px-4 rounded-lg ${activeTab === 'PetParent' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              PetParent
            </button>
          </div>
          <div>
            {activeTab === 'PetKeeper' && (
              <div>
            <PetKeeper/>
              </div>
            )}
            {activeTab === 'PetParent' && (
              <div>
              <PetParrent/>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
