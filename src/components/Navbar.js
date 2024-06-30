
import { GiHamburgerMenu } from "react-icons/gi";
import { GrFormClose } from "react-icons/gr";
import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { firebase } from "../Firebase/config";
import Link from "next/link";
import { FaUser, FaShoppingCart } from "react-icons/fa"; 

export default () => {

    const [state, setState] = useState(false)

    // Replace javascript:void(0) paths with your paths
    const navigation = [
        { title: "Home", path: "/" },
        { title: "AboutUs", path: "/About" },
        { title: "ContactUs", path: "/contact" },
    ]

    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
  
    useEffect(() => {
      const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
        if (authUser) {
          setUser(authUser);
          fetchUserData(authUser.uid); // Fetch user data based on UID
        } else {
          setUser(null);
          setUserData(null);
        }
      });
    
      return () => unsubscribe();
    }, []);
    console.log(user)
    
    // Function to fetch user data from Firestore
    const fetchUserData = async (uid) => {
      try {
        const userDoc = await firebase
          .firestore()
          .collection("petparents")
          .doc(uid)
          .get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          if (userData && userData.photoURL) {
            setUserData(userData);
          } else {
            // If photoURL is missing or undefined, set it to a default value or null
            setUserData({ ...userData, photoURL: null }); // You can set a default value or handle it as per your requirement
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    
    
    const [loggingOut, setLoggingOut] = useState(false);
    
    const handleLogout = async () => {
      try {
        setLoggingOut(true); // Set state to indicate logout is in progress
        await firebase.auth().signOut(); // Perform the logout action using Firebase Auth
        // Additional cleanup or state resetting if needed after logout
    
        setLoggingOut(false); // Reset state after successful logout
        window.location.reload();
      } catch (error) {
        console.error("Error during logout:", error);
        setLoggingOut(false); // Reset state in case of an error during logout
      }
    };
    
    const [showDropdown, setShowDropdown] = useState(false);
    
    const handleMouseEnter = () => {
      setShowDropdown(true);
    };
    
    const handleMouseLeave = () => {
      setShowDropdown(false);
    };

    return (
        <nav className="bg-white border-b w-full md:static md:text-sm md:border-none">
            <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8">
                <div className="flex items-center justify-between py-3 md:py-5 md:block">
                    <a href="/">
                    <div className="flex flex-shrink-0 items-center ">
                  <h1 className="cursor-pointer md:mr-0 mr-20 text-xl font-semibold ">
                    Pets<span className="text-orange-500">Parivaar</span>
                  </h1>
                </div>
                    </a>
                    <div className="md:hidden">
                        <button className="text-gray-500 hover:text-gray-800"
                            onClick={() => setState(!state)}
                        >
                            {
                                state ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                    </svg>
                                )
                            }
                        </button>
                    </div>
                </div>
                <div className={`flex-1 pb-3 mt-8 md:block md:pb-0 md:mt-0 ${state ? 'block' : 'hidden'}`}>
                    <ul className="justify-end items-center space-y-6 md:flex md:space-x-6 md:space-y-0">
                        {
                            navigation.map((item, idx) => {
                                return (
                                    <li key={idx} className="text-gray-700 hover:text-indigo-600">
                                        <a href={item.path} className="block">
                                            {item.title}
                                        </a>
                                    </li>
                                )
                            })
                        }
                        <span className='hidden w-px h-6 bg-gray-300 md:block'></span>
                        <div className='space-y-3 items-center gap-x-6 md:flex md:space-y-0'>
                            
                            <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {user && userData ? (
                  <div className="flex items-center space-x-3  relative hover:cursor-pointer">
                    <div className="flex items-center">
                      {userData.photoURL ? (
                        <img
                          src={userData.photoURL}
                          alt="User Profile"
                          className="md:w-8 md:h-8 w-8 h-8 rounded-full cursor-pointer"
                        />
                      ) : (
                        <FaUser className="md:w-6 md:h-6 w-8 md:mr-0 mr-28 h-8 text-black cursor-pointer" />
                      )}
                    </div>

                    {showDropdown && (
                      <div className="absolute  right-0 w-48 top-4   bg-white shadow-lg rounded-2xl dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-30">
                        <div
                          className="py-1 border-b border-gray-200 dark:border-gray-600"
                          role="none"
                        >
                          <p className="px-4 pt-2 mb-1 font-normal text-black dark:text-black">
                            Signed in as:
                          </p>
                          <a
                            href="/Profile"
                            className="flex px-4 py-2 text-sm font-semibold text-black border-l-2 border-transparent hover:border-red-600 dark:text-black dark:hover:text-black hover:text-red-600 dark:hover:text-red-600"
                          >
                            <span className="mr-2">
                              {userData.photoURL ? (
                                <img
                                  src={userData.photoURL}
                                  alt="User Profile"
                                  className="w-4 h-4 rounded-full cursor-pointer"
                                />
                              ) : (
                                <FaUser className="w-4 h-4 text-black cursor-pointer" />
                              )}
                            </span>
                            {userData.name}
                          </a>
                        </div>

                        <div className="py-1" role="none">
                          <a
                            href="/orders"
                            className="flex px-4 py-2 text-sm text-black border-l-2 border-transparent dark:hover:border-red-600 rounded-bl-md hover:border-red-600 dark:text-black dark:hover:text-black hover:text-red-600"
                          >
                            <span className="mr-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-4 h-4 hover:text-red-600 bi bi-bag"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M4 9h16v11a1 1 0 01-1 1H5a1 1 0 01-1-1V9zm7-6a2 2 0 012 2v2a2 2 0 01-2 2v0a2 2 0 01-2-2V5a2 2 0 012-2zm4 0a2 2 0 012 2v2a2 2 0 01-2 2v0a2 2 0 01-2-2V5a2 2 0 012-2z"
                                ></path>
                              </svg>
                            </span>
                            Our Order
                          </a>
                        </div>

                        <div className="py-1" role="none">
                          <button
                            onClick={handleLogout}
                            className="flex px-4 py-2 text-sm text-black border-l-2 border-transparent dark:hover:border-red-600 rounded-bl-md hover:border-red-600 dark:text-black dark:hover:text-black hover:text-red-600"
                          >
                            <span className="mr-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="w-4 h-4 hover:text-red-600 bi bi-box-arrow-right"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"
                                />
                                <path
                                  fill-rule="evenodd"
                                  d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
                                />
                              </svg>
                            </span>
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <li>
                  <a href="/signin" className="block py-3 text-center text-gray-700 hover:text-indigo-600 border rounded-lg md:border-none">
                      Log in
                  </a>
              </li>
                )}
               
              </div>
                            <li>
                                <a href='/PetKeeper/signin' className="block py-3 px-4 font-medium text-center text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 active:shadow-none rounded-lg shadow md:inline">
                                   PetKeeper
                                </a>
                            </li>
                        </div>
                    </ul>
                </div>
            </div>
        </nav>
    )
}