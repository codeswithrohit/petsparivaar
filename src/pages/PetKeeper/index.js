import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { firebase } from "../../Firebase/config";
import { isAbsoluteUrl } from "next/dist/shared/lib/utils";
import Link from "next/link";
const Dashboard = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  // Check if the user is an admin when the component mounts
  useEffect(() => {
    const isAdminInLocalStorage = localStorage.getItem("ispetkeeper") === "true";
    setIsAdmin(isAdminInLocalStorage);
    if (!isAdminInLocalStorage) {
      // If the user is not an admin, show a loading message or redirect them to the login page
      router.push("/PetKeeper");
    } else {
    }
  }, [router]);
 

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
  const fetchOrders = async () => {
    try {
      const userToken = JSON.parse(localStorage.getItem("myuser")).token;
      const requestBody = { token: userToken };

      // Include date range if provided
      if (startDate && endDate) {
        requestBody.startDate = startDate;
        requestBody.endDate = endDate;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/myorders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

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





 

  // Calculate counts for Active and Pending users

  const [todayorders, setTodayOrders] = useState([]);

  

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userToken = JSON.parse(localStorage.getItem("myuser")).token;
        const requestBody = { token: userToken };

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

          if (Array.isArray(data.orders)) {
            const today = new Date().toISOString().split('T')[0]; // Get current date in ISO format
            const todayOrders = data.orders.filter(order => order.createdAt.startsWith(today)); // Filter orders created today
            setTodayOrders(todayOrders);
          } else {
            console.error("Orders data is not an array:", data.orders);
          }
        } else {
          // Handle unsuccessful response if needed
        }
      } catch (error) {
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


  const filtertotalOrders = (orders) => {
    const email = localStorage.getItem("userEmail");
    return orders.filter((order) => order.products.petkeeperemail === email);
  };
  const filtertodayOrders = (todayorders) => {
    const email = localStorage.getItem("userEmail");
    return todayorders.filter((order) => order.products.petkeeperemail === email);
  };


  const totaltodayOrders = filtertotalOrders.length;
  const TotalOrder=filtertodayOrders.length
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };
  const [searchQuery, setSearchQuery] = useState('');
  const filteredOrderDetails = todayorders.filter((order, index) => {
    return (
      (order.email && order.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.orderId && typeof order.orderId === 'string' && order.orderId.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });
  return (
    <div className="">
      <div className="lg:ml-64 bg-white dark:bg-white min-h-screen">
      
        <section class="px-6 py-6">
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
         
            <div class="flex items-center justify-between p-4 border-l-2 border-green-500 rounded-md shadow dark:border-blue-400 dark:bg-gray-900 bg-gray-50">
              <div>
                <p class="mb-2 text-black dark:text-black">Total Order</p>
                <h2 class="text-2xl font-bold text-black dark:text-black">
               {TotalOrder}
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
                  placeholder="Search by Email and orderId"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <table class="min-w-full leading-normal">
                        <thead>
                          <tr>
                            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider">
                              OrderId
                            </th>
                            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider">
                              User Name
                            </th>
                            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider">
                              Email
                            </th>
                            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider">
                              Mobile Number
                            </th>
                            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider">
                              Address
                            </th>
                            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider">
                              Payment Status
                            </th>
                            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider">
                             Order Details
                            </th>

                           
                            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredOrderDetails.map((order, index) => (
                            <tr key={order._id}>
                              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p class="text-black whitespace-no-wrap">
                                  #{order.orderId}
                                </p>
                              </td>
                              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p class="text-black whitespace-no-wrap">
                                  {order.name}
                                </p>
                              </td>
                              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p class="text-black whitespace-no-wrap">
                                  {order.email}
                                </p>
                              </td>
                              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p class="text-black whitespace-no-wrap">
                                  {order.phonenumber}
                                </p>
                              </td>

                              <td class="px-5 py-5 border-b border-gray-200  bg-white text-sm">
                                <p class="text-black whitespace-no-wrap">
                                  {order.flatHouse},{order.locality},{order.location},{order.pincode}
                                </p>
                              </td>
                              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
  <p class="text-black whitespace-no-wrap">
   {order.status}
  </p>
</td>

                              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <Link
                                  href={`/Admin/Adminorder?id=${order._id}`}
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
