import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import * as XLSX from "xlsx";
import Link from "next/link";
const Dashboard = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if the user is an admin when the component mounts
  useEffect(() => {
    const isAdminInLocalStorage = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(isAdminInLocalStorage);
    if (!isAdminInLocalStorage) {
      // If the user is not an admin, show a loading message or redirect them to the login page
      router.push("/Admin/adminlogin");
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




  const downloadOrders = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(orders);
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, "orders.xlsx");
  };

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
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };
  const filteredOrderDetails = orders.filter((order, index) => {
    return (
      (order.email && order.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.orderId && typeof order.orderId === 'string' && order.orderId.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });
  return (
    <div className="">
      {loading ? (
        <p className="lg:ml-64 ">Loading...</p> // You can replace this with your desired loading indicator or component
      ) : (
        <>
          <div className="lg:ml-64 bg-white dark:bg-white min-h-screen">
          
<h1 className="text-xl font-bold text-center" >Orders </h1>
<div className="px-6 py-4">
                <input
                  type="text"
                  placeholder="Search by Email and orderId"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            <body class="antialiased font-sans ">
              <div class=" px-4 sm:px-8">
                <div class="py-8">
                  {/* <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold">Orders</h2>
                    <div className="space-x-4 flex flex-col md:flex-row ">
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="px-4 py-2 text-sm mb-2 font-semibold bg-red-600 border-none text-white rounded focus:outline-none"
                        placeholder="Start Date"
                      />

                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="px-4 py-2 text-sm mb-2 font-semibold bg-red-600 border-none text-white rounded focus:outline-none"
                        placeholder="End Date"
                      />

                      <button
                        onClick={fetchOrders}
                        className="px-4 py-2 text-sm mb-2 font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
                      >
                        Filter Orders
                      </button>
                      <button
                        onClick={downloadOrders}
                        className="px-4 py-2 text-sm mb-2 font-semibold bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-300"
                      >
                        Download Orders
                      </button>
                    </div>
                  </div> */}

                  <div class="my-2 ml-8 flex sm:flex-row flex-col">
                    <div class="flex flex-row mb-1 sm:mb-0">
                    
                    </div>
                  </div>
                  <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                    <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
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
              </div>
            </body>

            <script
              defer
              src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"
            ></script>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
