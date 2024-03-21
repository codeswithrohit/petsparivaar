
import { GiHamburgerMenu } from "react-icons/gi";
import { Disclosure } from "@headlessui/react";
import {
  MdOutlineSpaceDashboard,
  MdOutlineLogout,
} from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FaFileContract } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import React, { useState } from "react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { firebase } from "../Firebase/config";
import { useRouter } from "next/router";
function SideNavbar() {
  const [show, setShow] = useState(true);
  const router = useRouter();

  const handleLogout = async () => {
    try {

      // Remove isAdmin status from local storage
      localStorage.removeItem("isAdmin");

      // Sign out the user
      await firebase.auth().signOut();

      // Redirect to the login page after logout
      router.push("/Admin/adminlogin"); // Replace '/login' with your login page route
    } catch (error) {
      console.error("Error logging out:", error.message);
      toast.error(error.message);
    }
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
          <Link legacyBehavior href="/">
           <h1 className="mb-3 block text-base font-medium text-[#07074D]" >Admin PetParivaar</h1>
          </Link>
            <div className=" my-4 border-b border-gray-100 pb-4">
              <Link href='/Admin' className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <MdOutlineSpaceDashboard className="text-2xl text-gray-600 group-hover:text-white " />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">
                  Dashboard
                </h3>
              </Link>
              <Link href='/Admin/PetKeepers' className={`flex  mb-2 justify-start items-center gap-4 pl-5 p-2 rounded-md group cursor-pointer m-auto ${
      router.pathname === '/Admin/PetKeepers' ? 'bg-red-600 hover:bg-red-700' : 'hover:bg-gray-900'
    }`}>
      <CgProfile className={`text-2xl ${
        router.pathname === '/Admin/PetKeepers' ? 'text-white' : 'text-gray-600 group-hover:text-white'
      }`} />
      <h3 className={`text-base ${
        router.pathname === '/Admin/PetKeepers' ? 'text-white' : 'text-gray-800 group-hover:text-white'
      } font-semibold`}>
        Pet Keeper
      </h3>
    </Link>
              <Link href='/Admin/PetParrents' className={`flex  mb-2 justify-start items-center gap-4 pl-5 p-2 rounded-md group cursor-pointer m-auto ${
      router.pathname === '/Admin/PetParrents' ? 'bg-red-600 hover:bg-red-700' : 'hover:bg-gray-900'
    }`}>
      <CgProfile className={`text-2xl ${
        router.pathname === '/Admin/PetParrents' ? 'text-white' : 'text-gray-600 group-hover:text-white'
      }`} />
      <h3 className={`text-base ${
        router.pathname === '/Admin/PetParrents' ? 'text-white' : 'text-gray-800 group-hover:text-white'
      } font-semibold`}>
        Pet Parrents
      </h3>
    </Link>
             

              <Link href='/Admin/Product' className={`flex  mb-2 justify-start items-center gap-4 pl-5 p-2 rounded-md group cursor-pointer m-auto ${
      router.pathname === '/Admin/Product' ? 'bg-red-600 hover:bg-red-700' : 'hover:bg-gray-900'
    }`}>
      <IoIosAddCircle className={`text-2xl ${
        router.pathname === '/Admin/Product' ? 'text-white' : 'text-gray-600 group-hover:text-white'
      }`} />
      <h3 className={`text-base ${
        router.pathname === '/Admin/Product' ? 'text-white' : 'text-gray-800 group-hover:text-white'
      } font-semibold`}>
         Store Product
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