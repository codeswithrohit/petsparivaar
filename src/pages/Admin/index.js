import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { firebase } from "../../Firebase/config";
import { isAbsoluteUrl } from "next/dist/shared/lib/utils";
import Link from "next/link";
const Dashboard = () => {
  const router = useRouter(); // Use useRouter hook
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if the user is an admin when the component mounts
  useEffect(() => {
    const isAdminInLocalStorage = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(isAdminInLocalStorage);
    if (!isAdminInLocalStorage) {
      // If the user is not an admin, show a loading message or redirect them to the login page
      router.push("/Admin/adminlogin.html");
    } else {
      fetchOrderDetails();
      fetchOrderTodayDetails();
    }
  }, [router]);

  const [petkeeper, setPetkeeper] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRef = firebase.firestore().collection("petkeeper");
        const querySnapshot = await userRef.get();

        const fetchedpetkeeper = [];
        querySnapshot.forEach((doc) => {
          // Extract data for each document
          const data = doc.data();
          fetchedpetkeeper.push(data);
        });

        setPetkeeper(fetchedpetkeeper);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);
  const [petparent, setPetParrent] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRef = firebase.firestore().collection("petparents");
        const querySnapshot = await userRef.get();

        const fetchedpetkeeper = [];
        querySnapshot.forEach((doc) => {
          // Extract data for each document
          const data = doc.data();
          fetchedpetkeeper.push(data);
        });

        setPetParrent(fetchedpetkeeper);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

 

  // Calculate counts for Active and Pending users

 

  const [orderDetails, setOrderDetails] = useState([]);
  const [todayorderDetails, setTodayOrderDetails] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const fetchOrderDetails = async () => {
    try {
      const orderDocs = await firebase
        .firestore()
        .collection('Orders')
        .get();

      if (!orderDocs.empty) {
        const orderData = orderDocs.docs.map((doc) => ({ id: doc.id, ...doc.data(), loading: false }));
        // Sort orderData array based on timestamp in descending order
        orderData.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
        setOrderDetails(orderData);
      } else {
        console.error('Orders not found.');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };


  const fetchOrderTodayDetails = async () => {
    try {
      const today = new Date(); // Get today's date
      today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for accurate comparison
      
      const orderDocs = await firebase
        .firestore()
        .collection('Orders')
        .where('timestamp', '>=', firebase.firestore.Timestamp.fromDate(today)) // Filter orders with timestamp greater than or equal to today
        .get();
  
      if (!orderDocs.empty) {
        const orderData = orderDocs.docs.map((doc) => ({ id: doc.id, ...doc.data(), loading: false }));
        // Sort orderData array based on timestamp in descending order
        orderData.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
        setTodayOrderDetails(orderData);
      } else {
        console.error('Orders not found.');
      }
  
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };
  
  console.log(orderDetails)


  const totalPetKeepers = petkeeper.length;
  const totalPetParrents = petparent.length;
  const totalOrders = orderDetails.length;
  const totaltodayOrders = todayorderDetails.length;


  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000); // Convert to milliseconds
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleViewImage = (imageUrl) => {
    // Open the image in a new tab
    window.open(imageUrl, '_blank');
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredOrderDetails = todayorderDetails.filter((order, index) => {
    return (
      (order.userName && order.userName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.orderId && typeof order.orderId === 'string' && order.orderId.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });
  return (
    <div className="">
      <div className="lg:ml-64 bg-white dark:bg-white min-h-screen">
      
        <section class="px-6 py-6">
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div class="flex items-center justify-between p-4 border-l-2 border-yellow-500 rounded-md shadow dark:border-blue-400 dark:bg-gray-900 bg-gray-50">
              <div>
                <p class="mb-2 text-black dark:text-black">Total Pet Keepers</p>
                <h2 class="text-2xl font-bold text-black dark:text-black">
                  {totalPetKeepers}
                </h2>
              </div>
              <div>
                <span class="inline-block p-4 mr-2 text-white bg-yellow-500 rounded-full dark:text-black dark:bg-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="w-6 h-6 bi bi-bag-check"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z"
                    ></path>
                    <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"></path>
                  </svg>
                </span>
              </div>
            </div>
            <div class="flex items-center justify-between p-4 border-l-2 border-yellow-500 rounded-md shadow dark:border-blue-400 dark:bg-gray-900 bg-gray-50">
              <div>
                <p class="mb-2 text-black dark:text-black">Total Pet Parrents</p>
                <h2 class="text-2xl font-bold text-black dark:text-black">
                  {totalPetParrents}
                </h2>
              </div>
              <div>
                <span class="inline-block p-4 mr-2 text-white bg-yellow-500 rounded-full dark:text-black dark:bg-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="w-6 h-6 bi bi-bag-check"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z"
                    ></path>
                    <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"></path>
                  </svg>
                </span>
              </div>
            </div>
            <div class="flex items-center justify-between p-4 border-l-2 border-green-500 rounded-md shadow dark:border-blue-400 dark:bg-gray-900 bg-gray-50">
              <div>
                <p class="mb-2 text-black dark:text-black">Total Order</p>
                <h2 class="text-2xl font-bold text-black dark:text-black">
               {totalOrders}
                </h2>
              </div>
              <div>
                <span class="inline-block p-4 mr-2 text-white bg-green-500 rounded-full dark:text-black dark:bg-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="w-6 h-6 bi bi-bag-check"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z"
                    ></path>
                    <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"></path>
                  </svg>
                </span>
              </div>
            </div>
            <div class="flex items-center justify-between p-4 border-l-2 border-red-500 rounded-md shadow dark:border-blue-400 dark:bg-gray-900 bg-gray-50">
              <div>
                <p class="mb-2 text-black dark:text-black">Today Order</p>
                <h2 class="text-2xl font-bold text-black dark:text-black">
                  {totaltodayOrders}
                </h2>
              </div>
              <div>
                <span class="inline-block p-4 mr-2 text-white bg-red-500 rounded-full dark:text-black dark:bg-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="w-6 h-6 bi bi-bag-check"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z"
                    ></path>
                    <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"></path>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </section>
        <section className=" items-center lg:flex bg-gray-50  font-poppins dark:bg-gray-800 ">
        <div className="justify-center flex max-w-full px-4 py-4 mx-auto lg:py-8 md:px-6">
          <div className="overflow-x-auto bg-white rounded shadow dark:bg-gray-900">
            <div className="">
              <h2 className="px-6 py-4 pb-4 text-xl font-medium border-b border-gray-300 dark:border-gray-700 dark:text-gray-400">Today Orders</h2>
              <div className="px-6 py-4">
                <input
                  type="text"
                  placeholder="Search by Customer Name"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <table className="w-full table-auto">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr className="text-xs text-left text-gray-500 border-b border-gray-200 dark:border-gray-800">
                    <th className="px-6 py-3 font-medium dark:text-gray-400">Order ID</th>
                    <th className="px-6 py-3 font-medium dark:text-gray-400">Product Name</th>
                    <th className="px-6 py-3 font-medium dark:text-gray-400">Custome Name</th>
                    <th className="px-6 py-3 font-medium dark:text-gray-400">Order Date & Time</th>
                    <th className="px-6 py-3 font-medium dark:text-gray-400">View Payment Screenshot</th>
                    <th className="px-6 py-3 font-medium dark:text-gray-400">Customer Mobile Number</th>
                    <th className="px-6 py-3 font-medium dark:text-gray-400">Customer Address</th>
                    <th className="px-6 py-3 font-medium dark:text-gray-400">Total Amount</th>
                    <th className="px-6 py-3 font-medium dark:text-gray-400">Payment Status</th>
                    <th className="px-6 py-3 font-medium dark:text-gray-400">Order Status</th>
                    <th className="px-6 py-3 font-medium dark:text-gray-400">View details</th>
                    {/* Add more table headings as needed */}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrderDetails.map((order, index) => (
                    <tr key={index} className="border-b border-gray-200 dark:border-gray-800">
                      <td className="px-6 text-sm font-medium dark:text-gray-400">#{order.orderId}</td>
                      <td className="px-6 text-sm font-medium dark:text-gray-400">
                        {Object.keys(order.cart).map((productId) => (
                          <p key={productId} className="whitespace-no-wrap">
                            {order.cart[productId].productname}
                          </p>
                        ))}
                      </td>
                      <td className="px-6 text-sm font-medium dark:text-gray-400">{order.userName}</td>
                      <td className="px-6 text-sm font-medium dark:text-gray-400">{formatTimestamp(order.timestamp)}</td>
                      <td className="px-6 text-sm font-medium dark:text-gray-400">
                        {/* Display view button instead of image */}
                        <button className="cursor-pointer" onClick={() => handleViewImage(order.paymentScreenshot)}>View</button>
                      </td>
                      <td className="px-6 text-sm font-medium dark:text-gray-400">{order.userPhone}</td>
                      <td className="px-6 text-sm font-medium dark:text-gray-400">{order.userAddress}</td>
                      <td className="px-6 text-sm font-medium dark:text-gray-400">{order.subTotal}</td>
                      <td className="px-6 text-sm font-medium dark:text-gray-400">
                        {/* Add select option for payment status */}
                        <select value={order.Payment} onChange={(event) => handlePaymentChange(order.id, event)}>
                          <option value="pending">Pending</option>
                          <option value="success">Success</option>
                        </select>
                      </td>
                      <td className="px-6 text-sm font-medium dark:text-gray-400">
                        {/* Add select option for order status */}
                        <select value={order.Status} onChange={(event) => handleStatusChange(order.id, event)}>
                          <option value="Pending">Pending</option>
                          <option value="Order Placed">Order Placed</option>
                          <option value="Out od Delivery">Out od Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <Link
                          href={`/Admin/Payment.html?orderId=${order.orderId}`}
                          legacyBehavior
                        >
                          <span className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                            <span
                              aria-hidden
                              className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                            ></span>
                            <span className="relative">Details</span>
                          </span>
                        </Link>
                      </td>
                      {/* Add more table cells for other details */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
       
      </div>
    </div>
  );
};

export default Dashboard;
