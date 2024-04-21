import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { firebase } from "../../Firebase/config";

const Dashboard = () => {
  const router = useRouter();
  const [tab, setTab] = useState("total");
  const [searchQuery, setSearchQuery] = useState('');
  const [userData, setUserData] = useState(null);
  const [emails, setEmails] = useState('');
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const isAdminInLocalStorage = localStorage.getItem("ispetkeeper") === "true";
    if (!isAdminInLocalStorage) {
      router.push("/PetKeeper");
    } else {
      fetchOrders();
    }
  }, [router]);

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    setEmails(email)
    if (email) {
      fetchUserData(email);
    } else {
      router.push('/PetKeeper/signin');
    }
  }, [router]);

  const fetchUserData = async (emails) => {
    try {
      const querySnapshot = await firebase.firestore().collection('petkeeper').where("email", "==", emails).get();
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        setUserData(doc.data());
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoadingUserData(false);
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

  const openProfileModal = () => {
    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
  };




  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userToken = JSON.parse(localStorage.getItem("myuser")).token;
        const requestBody = { token: userToken };

        // Include date range if provided
        if (startDate && endDate) {
          requestBody.startDate = startDate;
          requestBody.endDate = endDate;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/myorders`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (res.ok) {
          const data = await res.json();

          // Assuming 'orders' is a property within the received object
          if (Array.isArray(data.orders)) {
            // Filter orders by date range if provided
            let filteredOrders = data.orders;

            if (startDate && endDate) {
              filteredOrders = filteredOrders.filter(
                (order) =>
                  new Date(order.createdAt) >= new Date(startDate) &&
                  new Date(order.createdAt) <= new Date(endDate)
              );
            }

            filteredOrders = filteredOrders.filter(
              (order) => order.products[Object.keys(order.products)[0]].petkeeperemail === emails
            );
    

            // Sort orders by createdAt in descending order (latest first)
            const sortedOrders = filteredOrders.sort((a, b) => {
              return new Date(b.createdAt) - new Date(a.createdAt);
            });
            setOrders(sortedOrders);
          } else {
            console.error("Orders data is not an array:", data.orders);
            // Handle this scenario according to your application logic
          }
        } else {
          // Handle unsuccessful response if needed
        }
      } catch (error) {
        // Handle fetch error
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!localStorage.getItem("myuser")) {
      router.push("/");
    } else {
      fetchOrders();
    }
  }, [router]);





  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
 

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  console.log("orders pet",orders)

  
  
  const filteredOrderDetails = orders.filter((order) => {
    return (
      (order.email && order.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.orderId && typeof order.orderId === 'string' && order.orderId.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });


  

  if (loadingUserData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex gap-2">
          <div className="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
          <div className="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
          <div className="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-white min-h-screen">
      <div className="mx-auto max-w-screen-xl bg-white">
        <div className="flex justify-between items-center py-4 px-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <h2 className="text-md font-bold text-gray-500">Hello,{userData.name}</h2>
          <div>
            <button
              onClick={openProfileModal}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-4"
            >
              View Profile
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="w-screen bg-gray-50">
          <div className="mx-auto max-w-screen-xl px-2 py-10">
            <div className="mt-4 w-full">
              <div className="flex w-full flex-col items-center justify-between space-y-2 sm:flex-row sm:space-y-0">
                <form className="relative flex w-full max-w-2xl items-center">
                  <svg className="absolute left-2 block h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" className=""></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65" className=""></line>
                  </svg>
                  <input type="name" name="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-12 w-full border-b-gray-400 bg-transparent py-4 pl-12 text-sm outline-none focus:border-b-2" placeholder="Search by name, email, orderid" />
                </form>
                {/* <button type="button" className="relative mr-auto inline-flex cursor-pointer items-center rounded-full border border-gray-200 bg-white px-5 py-2 text-center text-sm font-medium text-gray-800 hover:bg-gray-100 focus:shadow sm:mr-0">
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                  <svg className="mr-2 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filter
                </button> */}
              </div>
            </div>
            <div className="mt-6 overflow- rounded-xl bg-white px-6 shadow lg:px-4">
              <table className="min-w-full border-collapse border-spacing-y-2 border-spacing-x-2">
                <thead className=" border-b lg:table-header-group">
                  <tr className="">
                    <th className="whitespace-normal py-4 text-sm font-semibold text-gray-800 sm:px-3">
                      Order Date
                      <svg xmlns="http://www.w3.org/2000/svg" className="float-right mt-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </th>
                    <th className="whitespace-normal py-4 text-sm font-medium text-gray-500 sm:px-3">Order ID</th>
                    <th className="whitespace-normal py-4 text-sm font-medium text-gray-500 sm:px-3">Customer</th>
                    <th className="whitespace-normal py-4 text-sm font-medium text-gray-500 sm:px-3">Address</th>
                    <th className="whitespace-normal py-4 text-sm font-medium text-gray-500 sm:px-3">Payment Status</th>
                    <th className="whitespace-normal py-4 text-sm font-medium text-gray-500 sm:px-3">Order Details</th>
                  </tr>
                </thead>
                <tbody className="bg-white lg:border-gray-300">
                  {filteredOrderDetails.map((order, index) => (
                    <tr key={order._id} className="">
                      <td className="whitespace-no-wrap py-4 text-left text-sm text-gray-600 sm:px-3 lg:text-left">
                       {order.createdAt}
                      </td>
                      
                      <td className="whitespace-no-wrap  py-4 text-sm font-normal text-gray-600 sm:px-3 lg:table-cell">{order.orderId}</td>
                      <td className="whitespace-no-wrap  py-4 text-sm font-normal text-gray-600 sm:px-3 lg:table-cell">
                        <span className="flex flex-col">
                          <span className="font-semibold">{order.name}</span>
                          <span className="text-gray-500">{order.email}</span>
                          <span className="text-gray-500">{order.phonenumber}</span>
                        </span>
                      </td>
                      <td className="whitespace-no-wrap  py-4 text-left text-xs text-gray-600 sm:px-3 lg:table-cell lg:text-left">
                        <p className="text-black whitespace-no-wrap">
                          {order.flatHouse}, {order.locality}, {order.location}, {order.pincode}
                        </p>
                      </td>
                      <td className="whitespace-no-wrap  py-4 text-sm font-normal text-gray-500 sm:px-3 lg:table-cell">
                        <span className="ml-2 mr-3 whitespace-nowrap rounded-full bg-purple-100 px-2 py-0.5 text-purple-800">{order.status}</span>
                      </td>
                      <td className="whitespace-no-wrap  py-4 text-sm font-normal text-gray-500 sm:px-3 lg:table-cell">
                        <Link href={`/Admin/Adminorder?id=${order._id}`} legacyBehavior>
                          <span className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                            <span aria- className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                            <span className="relative">Details</span>
                          </span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {showProfileModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">User Profile</h2>
              <button onClick={closeProfileModal} className="text-gray-700 hover:text-gray-900 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Email: {userData.email}</p>
              <p className="text-sm text-gray-600">Phone Number: {userData.phoneNumber}</p>
              <p className="text-sm text-gray-600">Name: {userData.name}</p>
              <p className="text-sm text-gray-600">Is Pet Keeper: {userData.ispetkeeper}</p>
              <p className="text-sm text-gray-600">Address: {userData.flatHouse}, {userData.locality}, {userData.location}, {userData.pincode}</p>
              <p className="text-sm text-gray-600">Pets:</p>
              <ul>
                {userData.pets.map((pet, index) => (
                  <li key={index} className="ml-4">
                    <p>Type: {pet.type}</p>
                    <p>Price: {pet.price}</p>
                    <p>Service: {pet.service}</p>
                    <p>Options: {pet.options}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center">
              {/* Add any buttons or actions related to the profile here */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
