import React,{useState,useEffect} from 'react'
import {firebase }from '../Firebase/config';
import 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Dot } from 'recharts';
import moment from 'moment';
const AddPortfolio = () => {

  const CustomDot = (props) => {
    const { cx, cy, stroke, payload, value } = props;
  
    return (
      <Dot
        cx={cx}
        cy={cy}
        r={4}
        stroke={stroke}
        fill={value > 50 ? 'red' : 'green'} // Example of conditional coloring based on value
      />
    );
  };

    const db = firebase.firestore();
    const [showModal, setShowModal] = useState(false);
    const [showeditModal, setShowEditModal] = useState(false);
    const [currentDateTime, setCurrentDateTime] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    useEffect(() => {
      const intervalId = setInterval(() => {
        const now = new Date();
        const formattedDateTime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()} `;
        setCurrentDateTime(formattedDateTime);
      }, 1000); // Update every second
  
      return () => clearInterval(intervalId); // Cleanup interval on unmount
    }, []);
    const [portfolios, setPortfolios] = useState([]);
    const openModal = () => {
      setShowModal(true);
    };
    const closeModal = () => {
      setShowModal(false);
    };
    const openEditModal = () => {
      setShowEditModal(true);

    };
  
    const closeEditModal = () => {
      setShowEditModal(false);
    };
    useEffect(() => {
        const unsubscribe = db.collection('portfolios').onSnapshot((snapshot) => {
          const fetchedPortfolios = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPortfolios(fetchedPortfolios);
        });
    
        return () => unsubscribe();
      }, [db]);
console.log(portfolios)
    const [portfolioName, setPortfolioName] = useState('');
    const [portfolioValue, setPortfolioValue] = useState('');
    const [portfoliocurrentvalue, setPortfoliocurrentvalue] = useState('');
    const [portfolioPDf, setPortfolioPDf] = useState(null);
    const [portfolioActive, setPortfolioActive] = useState(true);
    const [loading, setLoading] = useState(false);
 
    const handleSubmit = async () => {
      setLoading(true);
      try {
        // Upload PDF file to Firebase Storage
        const storageRef = firebase.storage().ref();
        const fileRef = storageRef.child(`portfolio_pdfs/${portfolioPDf.name}`);
        await fileRef.put(portfolioPDf);
        const downloadURL = await fileRef.getDownloadURL();
        console.log(downloadURL)
        // Store portfolio data in Firestore with PDF URL
        await db.collection('portfolios').add({
          name: portfolioName,
          value: portfolioValue,
          active: portfolioActive,
          currentvalue:portfoliocurrentvalue,
          PDF: downloadURL, // Store PDF download URL
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        
        toast.success('Portfolio added successfully!');
        setShowModal(false);
      } catch (error) {
        console.error('Error adding portfolio: ', error);
        toast.error('Failed to add portfolio. Please try again.');
      } finally {
        setLoading(false);
        closeModal();
      }
    };
    
      const formatDate = (timestampSeconds) => {
        const date = new Date(timestampSeconds * 1000); // Convert seconds to milliseconds
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      };





      const [selectedportfolios, setSelectedportfolios] = useState(null);
  const [editedportfolios, setEditedportfolios] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(() => {
      const db = firebase.firestore();
      const portfoliossRef = db.collection("portfolios");

      portfoliossRef.get()
        .then((querySnapshot) => {
          const portfolios = [];
          querySnapshot.forEach((doc) => {
            portfolios.push({ ...doc.data(), id: doc.id });
          });

          setPortfolios(portfolios);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error getting documents: ", error);
          setLoading(false);
        });
    });

    return () => unsubscribe();
  }, []);

  // Function to handle showing E details
  const handleEditDetails = (portfolios) => {
    setSelectedportfolios(portfolios);
    setEditedportfolios({ ...portfolios });
    setShowEditModal(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedportfolios((prevportfolios) => ({
      ...prevportfolios,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editedportfolios) {
        const db = firebase.firestore();
        const portfolioRef = db.collection("portfolios").doc(editedportfolios.id);
  
        // Fetch the current value of historyvalue
        const doc = await portfolioRef.get();
        const historyvalue = doc.data().historyvalue || [];
  
        // Create a new array with the updated value and timestamp
        const updatedHistoryValue = [...historyvalue, {
          value: editedportfolios.currentvalue,
          datetime: currentDateTime
        }];
  
        // Update the document with the updated historyvalue array
        await portfolioRef.update({
          name: editedportfolios.name,
          value: editedportfolios.value,
          PDF: editedportfolios.PDF,
          currentvalue: editedportfolios.currentvalue,
          active: editedportfolios.active,
          historyvalue: updatedHistoryValue
        });
  
        setShowEditModal(false);
        setEditedportfolios(null);
        toast.success("Changes saved successfully!", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
        });
        // Reload the page after successful submission
        window.location.reload();
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("An error occurred while saving changes.", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
      });
    }
  };
  
  
  
  



  const handleDelete = async (id) => {
    try {
      const db = firebase.firestore();
      await db.collection("portfolios").doc(id).delete();
      const updatedData = portfolios.filter((item) => item.id !== id);
      setPortfolios(updatedData);
      toast.success("Deletion successful!", {
        position: toast.POSITION.TOP_CENTER,
      });
      window.location.reload();
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast.error("Deletion failed. Please try again.", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = portfolios.slice(startIndex, endIndex);

  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(portfolios.length / itemsPerPage);
 

  const [showGraph, setShowGraph] = useState(false);
  const [graphData, setGraphData] = useState([]);

  // Function to fetch and prepare data for the graph
  const fetchGraphData = (portfolioId) => {
    const portfolio = portfolios.find((portfolio) => portfolio.id === portfolioId);
    if (portfolio && portfolio.historyvalue) {
      const formattedData = portfolio.historyvalue.map((item) => ({
        datetime: item.datetime,
        value: item.value,
      }));
      setGraphData(formattedData);
      setShowGraph(true);
    }
  };

  const closeGraphModal = () => {
    setShowGraph(false);
  }; 
  return (
    <div>
 {loading ? (
      // Show loading indicator
      <div className=" lg:ml-64 flex justify-center items-center h-screen">
        <div className="spinner">Loading..</div> {/* Add your loading spinner component here */}
      </div>
    ) : (

        <div class="lg:ml-64 overflow-x-auto py-8">
          {/* Add portfolio Modal */}
        {showModal && (
  <div className="fixed z-10 inset-0 overflow-y-auto">
    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      {/* Background overlay */}
      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      {/* Modal content */}
      <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        {/* Modal content goes here */}
        <div className="max-w-full overflow-x-auto">
          <table className="w-full bg-white font-[sans-serif]">
            <thead className="whitespace-nowrap">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-black">
                  Portfolio Name
                </th>
               
                <th className="px-6 py-3 text-left text-sm font-semibold text-black">
                  Portfolio Value
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-black">
                  Portfolio Current Value
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-black">
                Upload PDF
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-black">
                  Active
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 fill-gray-400 inline cursor-pointer ml-2" viewBox="0 0 401.998 401.998">
                    <path d="M73.092 164.452h255.813c4.949 0 9.233-1.807 12.848-5.424 3.613-3.616 5.427-7.898 5.427-12.847s-1.813-9.229-5.427-12.85L213.846 5.424C210.232 1.812 205.951 0 200.999 0s-9.233 1.812-12.85 5.424L60.242 133.331c-3.617 3.617-5.424 7.901-5.424 12.85 0 4.948 1.807 9.231 5.424 12.847 3.621 3.617 7.902 5.424 12.85 5.424zm255.813 73.097H73.092c-4.952 0-9.233 1.808-12.85 5.421-3.617 3.617-5.424 7.898-5.424 12.847s1.807 9.233 5.424 12.848L188.149 396.57c3.621 3.617 7.902 5.428 12.85 5.428s9.233-1.811 12.847-5.428l127.907-127.906c3.613-3.614 5.427-7.898 5.427-12.848 0-4.948-1.813-9.229-5.427-12.847-3.614-3.616-7.899-5.42-12.848-5.42z" data-original="#000000" />
                  </svg>
                </th>
                
                <th className="px-6 py-3 text-left text-sm font-semibold text-black">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="whitespace-nowrap">
              <tr className="odd:bg-blue-50">
                <td className="px-6 py-3 text-sm">
                  <div className="flex items-center cursor-pointer">
                    <div className="ml-4">
                    <input type="text" placeholder='Enter Portfolio Name'   value={portfolioName}
                                onChange={(e) => setPortfolioName(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring focus:border-blue-500" />
                    </div>
                  </div>
                </td>
               
                <td className="px-6 py-3 text-sm">
                <input placeholder='Enter Portfolio Value' type="text" value={portfolioValue}
                            onChange={(e) => setPortfolioValue(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring focus:border-blue-500" />
                </td>
                <td className="px-6 py-3 text-sm">
                <input placeholder='Enter Portfolio Value' type="text" value={portfoliocurrentvalue}
                            onChange={(e) => setPortfoliocurrentvalue(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring focus:border-blue-500" />
                </td>
                <td className="px-6 py-3">
                <div>
                <label class="text-white dark:text-gray-200" for="portfoliocurrentvalue">Upload Aadhar Document</label>
                <input 
  type="file" 
  id="portfoliocurrentvalue" 
  name="portfoliocurrentvalue" 
  // Remove value attribute as it's not applicable for file inputs
  // value={portfolioPDf} 
  onChange={(e) => setPortfolioPDf(e.target.files[0])} // Capture file object
  accept=".pdf" 
  className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
/>

            </div>
  </td>

                <td className="px-6 py-3">
                  <label className="relative cursor-pointer">
                  <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={portfolioActive}
                              onChange={(e) => setPortfolioActive(e.target.checked)}
                            />
                    <div className="w-11 h-6 flex items-center bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:absolute after:left-[2px] peer-checked:after:border-white after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#007bff]">
                    </div>
                  </label>
                </td>
               
                
               
                <td className="px-6 py-3 text-sm">
                <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`px-4 py-2 bg-blue-500 text-white rounded-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {loading ? 'Loading...' : 'Submit'}
                          </button>
                </td>
             
              </tr>
              {/* Additional table rows go here */}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button type="button" onClick={closeModal} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{/* Edit Portfolio Modal */}

{showeditModal && (
  <div className="fixed z-10 inset-0 overflow-y-auto">
    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      {/* Background overlay */}
      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      {/* Modal content */}
      <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        {/* Modal content goes here */}
        <div className="max-w-full overflow-x-auto">
          <table className="w-full bg-white font-[sans-serif]">
            <thead className="whitespace-nowrap">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-black">
                  Portfolio Name
                </th>
               
                <th className="px-6 py-3 text-left text-sm font-semibold text-black">
                  Portfolio Value
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-black">
                  Portfolio Current Value
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-black">
                  Active
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 fill-gray-400 inline cursor-pointer ml-2" viewBox="0 0 401.998 401.998">
                    <path d="M73.092 164.452h255.813c4.949 0 9.233-1.807 12.848-5.424 3.613-3.616 5.427-7.898 5.427-12.847s-1.813-9.229-5.427-12.85L213.846 5.424C210.232 1.812 205.951 0 200.999 0s-9.233 1.812-12.85 5.424L60.242 133.331c-3.617 3.617-5.424 7.901-5.424 12.85 0 4.948 1.807 9.231 5.424 12.847 3.621 3.617 7.902 5.424 12.85 5.424zm255.813 73.097H73.092c-4.952 0-9.233 1.808-12.85 5.421-3.617 3.617-5.424 7.898-5.424 12.847s1.807 9.233 5.424 12.848L188.149 396.57c3.621 3.617 7.902 5.428 12.85 5.428s9.233-1.811 12.847-5.428l127.907-127.906c3.613-3.614 5.427-7.898 5.427-12.848 0-4.948-1.813-9.229-5.427-12.847-3.614-3.616-7.899-5.42-12.848-5.42z" data-original="#000000" />
                  </svg>
                </th>
                
                <th className="px-6 py-3 text-left text-sm font-semibold text-black">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="whitespace-nowrap">
              <tr className="odd:bg-blue-50">
                <td className="px-6 py-3 text-sm">
                  <div className="flex items-center cursor-pointer">
                    <div className="ml-4">
                    <input type="text" placeholder='Enter Portfolio Name'   value={editedportfolios.name}
                    onChange={(e) =>
                      setEditedportfolios({ ...editedportfolios, name: e.target.value })
                    } 
                    className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring focus:border-blue-500" />
                    </div>
                  </div>
                </td>
               
                <td className="px-6 py-3 text-sm">
                <input placeholder='Enter Portfolio Value' type="text" value={editedportfolios.value}
                    onChange={(e) =>
                      setEditedportfolios({ ...editedportfolios, value: e.target.value })
                    }  className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring focus:border-blue-500" />
                </td>
                <td className="px-6 py-3 text-sm">
                <input placeholder='Enter Portfolio Current Value' type="text" value={editedportfolios.currentvalue}
                    onChange={(e) =>
                      setEditedportfolios({ ...editedportfolios, currentvalue: e.target.value })
                    }  className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring focus:border-blue-500" />
                </td>
                <td className="px-6 py-3">
  <label className="relative cursor-pointer">
  <input
  type="checkbox"
  className="sr-only peer"
  checked={editedportfolios.active}
  onChange={(e) =>
    setEditedportfolios({ ...editedportfolios, active: e.target.checked })
  } 
/>

    <div className="w-11 h-6 flex items-center bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:absolute after:left-[2px] peer-checked:after:border-white after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#007bff]">
    </div>
  </label>
</td>

               
                
               
                <td className="px-6 py-3 text-sm">
                <button
                            onClick={handleEditSubmit}
                            disabled={loading}
                            className={`px-4 py-2 bg-blue-500 text-white rounded-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {loading ? 'Loading...' : 'Submit'}
                          </button>
                </td>
                <td className="px-6 py-3">
                  <button className="mr-4" title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 fill-blue-500 hover:fill-blue-700" viewBox="0 0 348.882 348.882">
                      {/* Edit SVG Path */}
                    </svg>
                  </button>
                  <button className="mr-4" title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 fill-red-500 hover:fill-red-700" viewBox="0 0 24 24">
                      {/* Delete SVG Path */}
                    </svg>
                  </button>
                </td>
              </tr>
              {/* Additional table rows go here */}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button type="button" onClick={closeEditModal} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}


{/* Show Graph */}

{showGraph && (
  <div className="flex flex-col items-center justify-center">
    <div className="w-full md:w-3/4 lg:w-1/2 bg-white rounded-lg shadow-lg">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Portfolio Graph</h2>
        <div className=" px-4 py-3 flex justify-end">
          <button
            type="button"
            onClick={closeGraphModal}
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Close
          </button>
        </div>
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <LineChart data={graphData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="datetime" tickFormatter={(tick) => moment(tick).format("M/D/YYYY h:mm:ss A")} /> {/* Format datetime */}
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#FF5733" strokeWidth={2} dot={<CustomDot />} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </div>
)}


      



        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl md:text-4xl text-black font-bold ml-4 text-center">Our Portfolio</h1>
          <button onClick={openModal} className="bg-blue-500 mr-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            + Add Portfolio
          </button>
        </div>
  <table class="min-w-full bg-white font-[sans-serif]">
    <thead class="whitespace-nowrap">
      <tr>
      
        <th class="px-6 py-3 text-left text-sm font-semibold text-black">
          Company Name
        </th>
        {/* <th class="px-6 py-3 text-left text-sm font-semibold text-black">
          Role
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 fill-gray-400 inline cursor-pointer ml-2"
            viewBox="0 0 401.998 401.998">
            <path
              d="M73.092 164.452h255.813c4.949 0 9.233-1.807 12.848-5.424 3.613-3.616 5.427-7.898 5.427-12.847s-1.813-9.229-5.427-12.85L213.846 5.424C210.232 1.812 205.951 0 200.999 0s-9.233 1.812-12.85 5.424L60.242 133.331c-3.617 3.617-5.424 7.901-5.424 12.85 0 4.948 1.807 9.231 5.424 12.847 3.621 3.617 7.902 5.424 12.85 5.424zm255.813 73.097H73.092c-4.952 0-9.233 1.808-12.85 5.421-3.617 3.617-5.424 7.898-5.424 12.847s1.807 9.233 5.424 12.848L188.149 396.57c3.621 3.617 7.902 5.428 12.85 5.428s9.233-1.811 12.847-5.428l127.907-127.906c3.613-3.614 5.427-7.898 5.427-12.848 0-4.948-1.813-9.229-5.427-12.847-3.614-3.616-7.899-5.42-12.848-5.42z"
              data-original="#000000" />
          </svg>
        </th> */}
        <th class="px-6 py-3 text-left text-sm font-semibold text-black">
          Active
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 fill-gray-400 inline cursor-pointer ml-2"
            viewBox="0 0 401.998 401.998">
            <path
              d="M73.092 164.452h255.813c4.949 0 9.233-1.807 12.848-5.424 3.613-3.616 5.427-7.898 5.427-12.847s-1.813-9.229-5.427-12.85L213.846 5.424C210.232 1.812 205.951 0 200.999 0s-9.233 1.812-12.85 5.424L60.242 133.331c-3.617 3.617-5.424 7.901-5.424 12.85 0 4.948 1.807 9.231 5.424 12.847 3.621 3.617 7.902 5.424 12.85 5.424zm255.813 73.097H73.092c-4.952 0-9.233 1.808-12.85 5.421-3.617 3.617-5.424 7.898-5.424 12.847s1.807 9.233 5.424 12.848L188.149 396.57c3.621 3.617 7.902 5.428 12.85 5.428s9.233-1.811 12.847-5.428l127.907-127.906c3.613-3.614 5.427-7.898 5.427-12.848 0-4.948-1.813-9.229-5.427-12.847-3.614-3.616-7.899-5.42-12.848-5.42z"
              data-original="#000000" />
          </svg>
        </th>
        <th class="px-6 py-3 text-left text-sm font-semibold text-black">
          Value
        </th>
        <th class="px-6 py-3 text-left text-sm font-semibold text-black">
          Current Value
        </th>
        <th class="px-6 py-3 text-left text-sm font-semibold text-black">
          Created at
        </th>
        <th class="px-6 py-3 text-left text-sm font-semibold text-black">
         Total Sold Share
        </th>
        <th class="px-6 py-3 text-left text-sm font-semibold text-black">
         View Graph
        </th>
        <th class="px-6 py-3 text-left text-sm font-semibold text-black">
          Action
        </th>
      </tr>
    </thead>
    <tbody class="whitespace-nowrap">
    {portfolios.map((portfolio, index) => (
      <tr key={portfolio.id}  class="odd:bg-blue-50">
        
        <td className="px-6 py-3 text-sm">
        <div className="flex items-center cursor-pointer">
          <div className="ml-4">
            <p className="text-sm text-black">{portfolio.name || '-'}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-3">
        <label className="relative cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            defaultChecked={portfolio.active}
          />
          <div className="w-11 h-6 flex items-center bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:absolute after:left-[2px] peer-checked:after:border-white after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#007bff]">
          </div>
        </label>
      </td>
      <td className="px-6 py-3 text-sm">₹ {portfolio.value || '-'}</td>
      <td className="px-6 py-3 text-sm">₹ {portfolio.currentvalue || '-'}</td>
      <td className="px-6 py-3 text-sm">
  {portfolio.createdAt ? formatDate(portfolio.createdAt.seconds) : '-'}
</td>

      <td className="px-6 py-3 text-sm">{portfolio.totalSoldShare || '-'}</td>
     
        <td class="px-6 py-3 text-sm">
        <button onClick={() => fetchGraphData(portfolio.id)}  class="px-4 py-2 bg-blue-500 text-white rounded-lg">View Graph</button>

        </td>
       
        <td class="px-6 py-3">
          <button  onClick={() => { handleEditDetails(portfolio); openEditModal(); }} class="mr-4" title="Edit">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 fill-blue-500 hover:fill-blue-700"
              viewBox="0 0 348.882 348.882">
              <path
                d="m333.988 11.758-.42-.383A43.363 43.363 0 0 0 304.258 0a43.579 43.579 0 0 0-32.104 14.153L116.803 184.231a14.993 14.993 0 0 0-3.154 5.37l-18.267 54.762c-2.112 6.331-1.052 13.333 2.835 18.729 3.918 5.438 10.23 8.685 16.886 8.685h.001c2.879 0 5.693-.592 8.362-1.76l52.89-23.138a14.985 14.985 0 0 0 5.063-3.626L336.771 73.176c16.166-17.697 14.919-45.247-2.783-61.418zM130.381 234.247l10.719-32.134.904-.99 20.316 18.556-.904.99-31.035 13.578zm184.24-181.304L182.553 197.53l-20.316-18.556L294.305 34.386c2.583-2.828 6.118-4.386 9.954-4.386 3.365 0 6.588 1.252 9.082 3.53l.419.383c5.484 5.009 5.87 13.546.861 19.03z"
                data-original="#000000" />
              <path
                d="M303.85 138.388c-8.284 0-15 6.716-15 15v127.347c0 21.034-17.113 38.147-38.147 38.147H68.904c-21.035 0-38.147-17.113-38.147-38.147V100.413c0-21.034 17.113-38.147 38.147-38.147h131.587c8.284 0 15-6.716 15-15s-6.716-15-15-15H68.904C31.327 32.266.757 62.837.757 100.413v180.321c0 37.576 30.571 68.147 68.147 68.147h181.798c37.576 0 68.147-30.571 68.147-68.147V153.388c.001-8.284-6.715-15-14.999-15z"
                data-original="#000000" />
            </svg>
          </button>
          <button onClick={() => handleDelete(portfolio.id)} class="mr-4" title="Delete">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 fill-red-500 hover:fill-red-700" viewBox="0 0 24 24">
              <path
                d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                data-original="#000000" />
              <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                data-original="#000000" />
            </svg>
          </button>
        </td>
      </tr>
    ))}
    </tbody>
  </table>
  <div class="fixed lg:ml-64 bottom-0 left-0 right-0 bg-white px-6 py-4 md:flex md:items-center md:justify-between">
  <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              {/* Back Button */}
              <button
                onClick={() => handlePaginationClick(currentPage - 1)}
                className={`px-4 py-2 text-sm text-white font-medium bg-red-300 rounded-md ${
                  currentPage === 1 ? "bg-red-400 cursor-not-allowed" : ""
                }`}
                disabled={currentPage === 1}
              >
                <FiChevronLeft className="inline-block mr-1" /> Previous
              </button>

              {/* Page Buttons */}
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePaginationClick(index + 1)}
                  className={`px-4 py-2 text-sm text-white font-medium bg-red-300 rounded-md ${
                    currentPage === index + 1 ? "bg-red-400" : ""
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => handlePaginationClick(currentPage + 1)}
                className={`px-4 py-2 text-sm text-white font-medium bg-red-300 rounded-md ${
                  currentPage === totalPages
                    ? "bg-red-400 cursor-not-allowed"
                    : ""
                }`}
                disabled={currentPage === totalPages}
              >
                Next <FiChevronRight className="inline-block ml-1" />
              </button>
            </div>
          </div>
  </div>
  
</div>
    )}

<ToastContainer/>
    </div>
  )
}

export default AddPortfolio