import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../Firebase/config';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast

import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

const SignIn = () => {
  const [activeTab, setActiveTab] = useState('PetParent');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      setLoading(true); // Set loading state to true

      // Sign in the user with email and password
      await auth.signInWithEmailAndPassword(email, password);
      // Redirect to a protected page or perform any other actions
       // Change '/dashboard' to your desired destination
      // Show a success toast notification
      toast.success('You have signed in successfully!', {
        position: 'top-right',
        autoClose: 3000, // Close the notification after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      router.push('/');
    } catch (error) {
      console.error(error);
      // Handle sign-in error, e.g., display an error message to the user
      // Show an error toast notification
      toast.error('Sign-in failed. Please check your credentials and try again.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false); // Set loading state back to false
    }
  };


  const handleSignInPetkeeper = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Sign in the user with email and password
      await firebase.auth().signInWithEmailAndPassword(email, password);

      // Check if the signed-in user is a pet keeper
      const isPetKeeper = await checkPetKeeper(email);

      if (isPetKeeper) {
        // If the user is a pet keeper, set 'ispetkeeper' to true in localStorage
        localStorage.setItem("ispetkeeper", true);
      }

      // Store the user's email in localStorage
      localStorage.setItem("userEmail", email);

      // Redirect to a protected page or perform any other actions
      router.push('/PetKeeper'); // Change '/dashboard' to your desired destination

      // Show a success toast notification
      toast.success('You have signed in successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error(error);
      // Handle sign-in error
      toast.error('Sign-in failed. Please check your credentials and try again.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const checkPetKeeper = async (email) => {
    try {
      // Check if the user's email exists in the 'petkeeper' collection in Firestore
      const doc = await firebase.firestore().collection('petkeeper').doc(email).get();
      return doc.exists;
    } catch (error) {
      console.error('Error checking pet keeper:', error);
      return false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="mb-4">
          <div className="flex justify-center mb-4">
            <button
              className={`px-4 py-2 mx-2 ${activeTab === 'PetKeeper' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-full transition duration-300`}
              onClick={() => setActiveTab('PetKeeper')}
            >
              PetKeeper
            </button>
            <button
              className={`px-4 py-2 mx-2 ${activeTab === 'PetParent' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-full transition duration-300`}
              onClick={() => setActiveTab('PetParent')}
            >
              PetParent
            </button>
          </div>
        </div>
        {activeTab === 'PetKeeper' ? (
          <div>
            <h2 className="text-center text-2xl font-bold mb-4">Sign in as PetKeeper</h2>
            {/* Add your PetKeeper login form here */}
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                   type="email"
                   id="email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                 
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                 type="password"
                 id="password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
               
                />
              </div>
              <div className=" items-center justify-between">
                <button
                  type="submit"
                  onClick={handleSignInPetkeeper}   disabled={loading}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                >
              {loading ? 'Loading...' : 'Login'}
                </button>
                <a className="w-full text-center text-sm font-medium text-gray-600 hover:underline" href="/Forgotpassword">Forgot your password?</a>
                <p  class="text-sm mt-8 text-center">Don't have an account <a  href="/petkeeperregistration" class="text-[#1E2772] hover:underline ml-1 whitespace-nowrap">Register here</a></p>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <h2 className="text-center text-2xl font-bold mb-4">Sign in as PetParent</h2>
            {/* Add your PetParent login form here */}
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                   type="email"
                   id="email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                 
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                 type="password"
                 id="password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
               
                />
              </div>
              <div className=" items-center justify-between">
                <button
                  type="submit"
                  onClick={handleSignIn}   disabled={loading}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                >
              {loading ? 'Loading...' : 'Login'}
                </button>
                <a className="w-full text-center text-sm font-medium text-gray-600 hover:underline" href="/Forgotpassword">Forgot your password?</a>
                <p  class="text-sm mt-8 text-center">Don't have an account <a  href="/petparrent" class="text-[#1E2772] hover:underline ml-1 whitespace-nowrap">Register here</a></p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignIn;
