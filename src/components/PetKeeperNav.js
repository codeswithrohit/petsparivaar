
import { GiHamburgerMenu } from "react-icons/gi";
import { Disclosure } from "@headlessui/react";
import {
  MdOutlineSpaceDashboard,
  MdOutlineLogout,
} from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FaFileContract } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import React, { useState,useEffect } from "react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { firebase } from "../Firebase/config";
import { useRouter } from "next/router";
function SideNavbar() {
  const [show, setShow] = useState(true);
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      fetchUserData(email);
    } else {
      router.push('/PetKeeper/signin');
    }
  }, [router]);

  const fetchUserData = async (email) => {
    try {
      const querySnapshot = await firebase.firestore().collection('petkeeper').where("email", "==", email).get();
      if (!querySnapshot.empty) {
        // Assuming there's only one document for each email, so accessing the first one
        const doc = querySnapshot.docs[0];
        setUserData(doc.data());
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  const handleLogout = () => {
    // Clear user authentication state
    firebase.auth().signOut().then(() => {
      // Clear user-related data in localStorage
      localStorage.removeItem("ispetkeeper");
      localStorage.removeItem('userEmail');
      // Redirect to the sign-in page
      router.push('/PetKeeper/signin');
    }).catch((error) => {
      console.error('Error signing out:', error);
    });
  };






  return (
    <div>
      <Disclosure as="nav">
        <Disclosure.Button className="absolute top-4 right-4 inline-flex items-center peer justify-center rounded-md p-2 text-gray-800 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white group">
          <GiHamburgerMenu
            className="block md:hidden h-6 w-6"
            aria-hidden="true"
          />
        </Disclosure.Button>
        <div className="p-6 w-1/2 h-screen overflow-y-auto bg-white z-20 fixed top-0 -left-96 lg:left-0 lg:w-60  peer-focus:left-0 peer:transition ease-out delay-150 duration-200">
          <div className="flex flex-col justify-start item-center">
          {userData ? (
          <Link legacyBehavior href="/">
           <h1 className="mb-3 block text-base font-medium text-[#07074D]" >Hello , {userData.name}!</h1>
          </Link>
           ) : (
            <p>Loading user data...</p>
          )}
            <div className=" my-4 border-b border-gray-100 pb-4">
              <Link href='/Admin' className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <MdOutlineSpaceDashboard className="text-2xl text-gray-600 group-hover:text-white " />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">
                  Dashboard
                </h3>
              </Link>
             
             

              <Link href='/PetKeeper/PetOrders' className={`flex  mb-2 justify-start items-center gap-4 pl-5 p-2 rounded-md group cursor-pointer m-auto ${
      router.pathname === '/PetKeeper/PetOrders' ? 'bg-red-600 hover:bg-red-700' : 'hover:bg-gray-900'
    }`}>
      <IoIosAddCircle className={`text-2xl ${
        router.pathname === '/PetKeeper/PetOrders' ? 'text-white' : 'text-gray-600 group-hover:text-white'
      }`} />
      <h3 className={`text-base ${
        router.pathname === '/PetKeeper/PetOrders' ? 'text-white' : 'text-gray-800 group-hover:text-white'
      } font-semibold`}>
         Order
      </h3>
    </Link>
             
   


            </div>
            {/* setting  */}
           
            {/* logout */}
            <div onClick={handleLogout} className=" my-4">
              <div className="flex mb-2 justify-start items-center gap-4 pl-5 border border-gray-200  hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <MdOutlineLogout className="text-2xl text-gray-600 group-hover:text-white " />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">
                  Logout
                </h3>
              </div>
            </div>
          </div>
        </div>
      </Disclosure>
      <ToastContainer />
    </div>
  );
}

export default SideNavbar;