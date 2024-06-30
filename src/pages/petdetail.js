import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { firebase } from '../Firebase/config';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'; // Import Firestore
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';

const PetDetail = ({bookNow}) => {
  const router = useRouter();
  const { query } = router;
  const [fetchedData, setFetchedData] = useState([]);
  const [distances, setDistances] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  // Access the query parameters here
  const {
    petType,
    serviceOption,
    Date,
    dogSize,
    location,
    nearestLocation,
  } = query;

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        fetchUserData(authUser.uid);
      } else {
        setUser(null);
        setUserData(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid) => {
    try {
      const userDoc = await firebase
        .firestore()
        .collection("petparents")
        .doc(uid)
        .get();
      if (userDoc.exists) {
        const fetchedUserData = userDoc.data();
        setUserData(fetchedUserData);
        setPhoneNumber(fetchedUserData?.phoneNumber || "");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };
  // Use the received query parameters in your component as needed

  useEffect(() => {
    const fetchData = async () => {
      try {
        const collectionRef = firebase.firestore().collection('petkeeper').where("Verified", "==", "True");
  
        const querySnapshot = await collectionRef.get();
        const data = querySnapshot.docs.map((doc) => {
          const userData = doc.data();
          return {
            ...userData,
            distance: null,
          };
        });
  
        // Filter the fetched data based on petType and serviceOption
        const filteredData = data.filter(item => {
          return item.pets.some(pet => pet.type === petType && pet.service === serviceOption);
        });
  
        setFetchedData(filteredData);
  
        const distances = await Promise.all(
          filteredData.map(async (item) => {
            const formattedDistance = await calculateDistance(location, item.location);
            return formattedDistance;
          })
        );
  
        const updatedData = filteredData.map((item, index) => ({
          ...item,
          distance: distances[index],
        }));
  
        setFetchedData(updatedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error fetching data from Firestore.');
        setLoading(false);
      }
    };
  
    fetchData();
  }, [location, petType, serviceOption]);
   // Re-run the effect when the location changes
  // Function to calculate distance between two locations using Haversine formula
  const calculateDistance = (location1, location2) => {
    return new Promise((resolve, reject) => {
      if (location1.trim() !== '' && location2.trim() !== '') {
        const service = new window.google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
          {
            origins: [location1],
            destinations: [location2],
            travelMode: 'DRIVING',
          },
          (response, status) => {
            if (status === 'OK' && response.rows && response.rows.length > 0 && response.rows[0].elements && response.rows[0].elements.length > 0) {
              const { distance } = response.rows[0].elements[0];
              if (distance) {
                const distanceValue = distance.value; // Distance in meters
                const distanceKm = distanceValue / 1000; // Convert distance to kilometers
                const formattedDistance = `${distance.text}`; // Construct the desired format
                console.log('Distance:', formattedDistance);
                resolve(formattedDistance);
              }
            } else {
              console.log('Error:', status);
              reject(null);
            }
          }
        );
      } else {
        console.log('Please enter both locations.');
        reject(null);
      }
    });
  };

  // Filter fetchedData based on distances less than 15 km
  const filteredData = fetchedData.filter(item => parseFloat(item.distance) < parseFloat(nearestLocation));

  console.log("fetchedData",fetchedData);

const PetDate = Date
 


  return (
    <div className="px-8 min-h-screen ">
      <Head>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyB6gEq59Ly20DUl7dEhHW9KgnaZy4HrkqQ&libraries=places`}
          async
          defer
        ></script>
      </Head>

     
      <p className="font-serif text-xl font-bold text-blue-900">Search for this</p>
      <div class="font-[sans-serif] w-max mx-auto bg-white border-2 border-[#333] flex rounded overflow-hidden grid grid-cols-1 md:grid-cols-5 md:w-auto">

  <button 
    type="button"
    class="px-6 py-2.5 flex items-center text-[#333] text-xs md:text-xs tracking-wider font-semibold border-r-2 border-[#333] outline-none hover:text-white hover:bg-[#333] active:bg-[#111] transition-all">
    <span class="mr-2">Pet Type:</span>
    <span class="mr-1">{petType}</span>
    <span class="text-gray-500">for</span>
    <span class="ml-1">{serviceOption}</span>
  </button>
  
  <button 
    type="button"
    class="px-6 py-2.5 flex items-center text-[#333] text-xs md:text-xs tracking-wider font-semibold border-r-2 border-[#333] outline-none hover:text-white hover:bg-[#333] active:bg-[#111] transition-all">
    Date: {Date}
  </button>
  
  <button 
    type="button"
    class="px-6 py-2.5 flex items-center text-[#333] text-xs md:text-xs tracking-wider font-semibold border-r-2 border-[#333] outline-none hover:text-white hover:bg-[#333] active:bg-[#111] transition-all">
    Pet Size: {dogSize}
  </button>
  
 
  
  <button 
    type="button"
    class="px-6 py-2.5 flex items-center text-[#333] text-xs md:text-xs tracking-wider font-semibold border-r-2 border-[#333] outline-none hover:text-white hover:bg-[#333] active:bg-[#111] transition-all">
    Location: {location}
  </button>
  
  <button 
    type="button"
    class="px-6 py-2.5 flex items-center text-[#333] text-xs md:text-xs tracking-wider font-semibold border-r-2 border-[#333] outline-none hover:text-white hover:bg-[#333] active:bg-[#111] transition-all">
    Nearest Radius: {nearestLocation} km
  </button>
</div>
<p className="font-serif text-xl font-bold text-blue-900">Results</p>

    
      {loading ? ( // Show spinner while loading
        <div class="flex justify-center items-center h-screen">
        <div class="flex gap-2">
          <div class="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
          <div class="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
          <div class="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
        </div>
      </div>
      
      ) : (
        <>
        {/* Check if filteredData has items */}
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            // Your result items rendering here
            <div key={index} className="w-96 p-4 bg-gray-100 dark:bg-gray-800 border-gray-800 shadow-md hover:shodow-lg rounded-md">
          <div className="flex-none lg:flex">
           
            <div className="flex-auto lg:ml-3 justify-evenly py-2">
              <div className="flex flex-col">
                {/* <div className="flex items-center mr-auto text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <p className="font-normal text-gray-500">4.5</p>
                </div> */}
                <div className="flex items-center  justify-between min-w-0">
                  <h2 className="mr-auto text-green-600 text-center  text-base capitalize font-medium truncate">{item.name}</h2>
                </div>
                <p className="flex capitalize items-center text-xs text-gray-400">{item.location}. {item.distance} <span className="relative inline-flex rounded-md shadow-sm ml-2">
                    <span className="flex absolute h-2 w-2 top-0 right-0 -mt-1 -mr-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  </span>
                </p>
              </div>
              <div className="flex my-3 border-t border-gray-300 dark:border-gray-600 "></div>
              <div className="flex space-x-3 text-sm font-medium">
              <ul className="divide-y divide-gray-200">
  {item.pets.map((pet, petIndex) => (
    <li key={petIndex} className="py-2 flex items-center justify-between">
      <div>
        <span className="font-semibold">{petIndex + 1}. Pet Type:</span> {pet.type}, <span className="font-semibold">Service:</span> {pet.service}
      </div>
      <div className="flex items-center gap-1 font-medium text-gray-700 dark:text-gray-100">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>{pet.price}</span><span className="text-gray-500 text-sm font-normal"> /Day</span>
      </div>
      <button 
  className="flex-no-shrink ml-2 bg-green-600 hover:bg-green-800 px-5 py-2 text-xs shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-blue-500 hover:border-blue-800 text-white rounded-full transition ease-in duration-300" 
  type="button" 
  aria-label="like" 
  onClick={() => bookNow(1, 1, pet.type, pet.price, pet.service, item.name, item.location,item.email,PetDate)}>
  Book Now
</button>

    </li>
  ))}
</ul>

</div>


             
            </div>
          </div>
        </div>
          ))
        ) : (
          // No data message
          <div className="flex justify-center items-center h-screen">
            <p className="font-bold text-xl text-gray-500">No data found.</p>
          </div>
        )}
      </>
      )}
      
    
    </div>
  );
};

export default PetDetail;
