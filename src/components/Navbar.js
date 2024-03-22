import { Disclosure } from "@headlessui/react";
import { GiHamburgerMenu } from "react-icons/gi";
import { GrFormClose } from "react-icons/gr";
import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { firebase } from "../Firebase/config";
import Link from "next/link";
import { FaUser, FaShoppingCart } from "react-icons/fa"; 
const navigation = [
  { name: "Home", href: "/", current: true },
  { name: "AboutUs", href: "/About", current: false },
  // { name: "Services", href: "#", current: false },
  { name: "Contact Us", href: "/contact", current: false },
  // { name: "Testimonial", href: "#", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}






export default function Navbar() {
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
    <Disclosure as="nav" className="bg-white">
      {({ open }) => (
        <>
          <div className="min-w-7xl mx-auto border-b border-gray-50 bg-white px-2 sm:px-6 lg:px-8">
            <div className="relative mx-0 flex h-16 items-center justify-between md:mx-20">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-orange-500 hover:bg-orange-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <GrFormClose className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <GiHamburgerMenu
                      className="block h-6 w-6"
                      aria-hidden="true"
                    />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center ">
                  <h1 className="cursor-pointer md:mr-0 mr-20 text-xl font-semibold ">
                    Pets<span className="text-orange-500">Parivaar</span>
                  </h1>
                </div>
                <div className="hidden sm:ml-6 sm:block md:ml-60">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-orange-500 text-white shadow-lg"
                            : "text-gray-500 hover:bg-orange-500 hover:text-white hover:shadow-lg",
                          "rounded-full px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              
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
                            href="/Order-History"
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
                    <div className="absolute md:mr-0 mr-24 inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <Link href='/signin' >
                <button className="rounded-full border border-orange-100 px-3 py-2 text-sm font-medium text-orange-500 hover:bg-orange-500 hover:text-white  hover:shadow-lg">
                  login
                </button>
                </Link>
              </div>
                )}
               
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <Link href='/petkeepersignin' >
                <button className="rounded-full border border-orange-100 px-3 py-2 text-sm font-medium text-orange-500 hover:bg-orange-500 hover:text-white  hover:shadow-lg">
                  Pet Keeper
                </button>
                </Link>
              </div>




            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-orange-500 text-white shadow-lg"
                      : "text-gray-500 hover:bg-orange-500 hover:text-white hover:shadow-lg",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
