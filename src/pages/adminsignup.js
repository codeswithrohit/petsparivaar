/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import 'firebase/storage';
import 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { firebase } from '../Firebase/config';

const AdminSignup = () => {
  const router = useRouter();


 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

   



  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        firebase.auth(),
        email,
        password
      );

      // Access user object from userCredential
      const user = userCredential.user;

      // Store additional user data in Firestore
      if (user) {
        // Set isAdmin to true for admin users during account creation
        await firebase.firestore().collection('Adminusers').doc(email).set({
          name: name,
          email: email,
          isAdmin: true, // Set the admin flag
        });

      
        toast.success('Account created successfully!');
        // Redirect to the home page after successful registration
        // Replace '/admin/home' with your desired home page route
        window.location.replace('/');
      }
    } catch (error) {
      console.error('Error signing up:', error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
    <main className="w-full m-auto min-h-screen bg-white dark:bg-white flex flex-col items-center justify-center  sm:px-4">
        <div className="w-full space-y-6 text-gray-600 sm:max-w-md">
         
          <div className="bg-white shadow p-4 py-6 sm:p-6 sm:rounded-lg">
            <form onSubmit={handleSignUp} className="space-y-5">
              <div>
                <label className="font-medium">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg" />
              </div>
              <div>
                <label className="font-medium">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg" />
              </div>
              <div>
                <label className="font-medium">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg" />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
              >
                {loading ? 'Creating...' : 'Create account'}
              </button>
            </form>
          </div>
        </div>
        {/* Show toast messages */}
        <ToastContainer />
      </main></>
  );
};

export default AdminSignup;
