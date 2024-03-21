
import { FaUser, FaMobileAlt, FaMapMarker } from "react-icons/fa";
import { useState, useEffect } from "react";
import { firebase } from "../Firebase/config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await firebase.firestore().collection("petparents").doc(user.uid).update({
        phoneNumber,
      });
      setEditMode(false);
      toast.success("Profile Updated Successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Error updating profile");
    }
  };
  console.log(userData)
  return (
    <div >
      <div className="flex flex-col font-sans py-10 md:flex-row min-h-screen bg-gray-white">
        <form
          onSubmit={handleSubmit}
          class="font-[sans-serif] m-6 max-w-4xl mx-auto"
        >
          {user && userData ? (
            <div>
              <div className="flex items-center justify-center">
                {userData.photoURL ? (
                  <img
                    src={userData.photoURL}
                    alt="User"
                    className="w-20 h-20 rounded-full mb-4 md:mb-8"
                  />
                ) : (
                  <FaUser className="w-20 h-20 rounded-full mb-4 md:mb-8" />
                )}
              </div>

              <div class="grid sm:grid-cols-2 gap-10">
                <div class="relative flex items-center">
                  <label class="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter first name"
                    value={userData.name}
                    readOnly
                    class="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-blue-500 rounded outline-none"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    class="w-[18px] h-[18px] absolute right-4"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="10"
                      cy="7"
                      r="6"
                      data-original="#000000"
                    ></circle>
                    <path
                      d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                      data-original="#000000"
                    ></path>
                  </svg>
                </div>
                <div class="relative flex items-center">
                  <label class="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                    Phone No
                  </label>
                  <input
                    type="number"
                    placeholder="Enter phone no."
                    value={editMode ? phoneNumber : userData.phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    readOnly={!editMode}
                    class="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-blue-500 rounded outline-none"
                  />
                  <svg
                    fill="#bbb"
                    class="w-[18px] h-[18px] absolute right-4"
                    viewBox="0 0 64 64"
                  >
                    <path
                      d="m52.148 42.678-6.479-4.527a5 5 0 0 0-6.963 1.238l-1.504 2.156c-2.52-1.69-5.333-4.05-8.014-6.732-2.68-2.68-5.04-5.493-6.73-8.013l2.154-1.504a4.96 4.96 0 0 0 2.064-3.225 4.98 4.98 0 0 0-.826-3.739l-4.525-6.478C20.378 10.5 18.85 9.69 17.24 9.69a4.69 4.69 0 0 0-1.628.291 8.97 8.97 0 0 0-1.685.828l-.895.63a6.782 6.782 0 0 0-.63.563c-1.092 1.09-1.866 2.472-2.303 4.104-1.865 6.99 2.754 17.561 11.495 26.301 7.34 7.34 16.157 11.9 23.011 11.9 1.175 0 2.281-.136 3.29-.406 1.633-.436 3.014-1.21 4.105-2.302.199-.199.388-.407.591-.67l.63-.899a9.007 9.007 0 0 0 .798-1.64c.763-2.06-.007-4.41-1.871-5.713z"
                      data-original="#000000"
                    ></path>
                  </svg>
                </div>
                <div class="relative flex items-center sm:col-span-2">
                  <label class="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={userData.email}
                    readOnly
                    class="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-blue-500 rounded outline-none"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    class="w-[18px] h-[18px] absolute right-4"
                    viewBox="0 0 682.667 682.667"
                  >
                    <defs>
                      <clipPath id="a" clipPathUnits="petparentspaceOnUse">
                        <path
                          d="M0 512h512V0H0Z"
                          data-original="#000000"
                        ></path>
                      </clipPath>
                    </defs>
                    <g
                      clip-path="url(#a)"
                      transform="matrix(1.33 0 0 -1.33 0 682.667)"
                    >
                      <path
                        fill="none"
                        stroke-miterlimit="10"
                        stroke-width="40"
                        d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                        data-original="#000000"
                      ></path>
                      <path
                        d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                        data-original="#000000"
                      ></path>
                    </g>
                  </svg>
                </div>
                <div class="relative flex items-center">
                  <label class="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                    Flat House 
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Flat House"
                    value={userData.flatHouse}
                    readOnly
                    class="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-blue-500 rounded outline-none"
                  />
                
                </div>
                <div class="relative flex items-center">
                  <label class="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
Locality                  </label>
                  <input
                    type="text"
                    placeholder="Enter Locality"
                    value={userData.locality}
                    readOnly
                    class="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-blue-500 rounded outline-none"
                  />
                
                </div>
                <div class="relative flex items-center">
                  <label class="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
LandMark                </label>
                  <input
                    type="text"
                    placeholder="Enter LandMark"
                    value={userData.landmark}
                    readOnly
                    class="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-blue-500 rounded outline-none"
                  />
                
                </div>
                <div class="relative flex items-center">
                  <label class="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                  Pincode             </label>
                  <input
                    type="text"
                    placeholder="Enter Pincode"
                    value={userData.pincode}
                    readOnly
                    class="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-blue-500 rounded outline-none"
                  />
                
                </div>
                <div class="relative flex items-center sm:col-span-2">
                  <label class="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Location"
                    value={userData.location}
                    readOnly
                    class="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-blue-500 rounded outline-none"
                  />
                </div>
              </div>
              {userData.pets && userData.pets.length > 0 && (
  <div className="overflow-x-auto">
    <h2 className="text-lg font-semibold mb-4 mt-4">Your Pets Details</h2>
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Pet
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Type
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Vaccinated
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Medical History
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Age
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Breed
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {userData.pets.map((pet, index) => (
          <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{`${index + 1}`}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{pet.type}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{pet.vaccinated ? 'Yes' : 'No'}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{pet.medicalHistory}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{pet.age}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{pet.breed}</div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}



              <div className="flex justify-center mt-4">
                <button
                  type="button"
                  onClick={() => setEditMode(true)}
                  className={`mr-4 px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded hover:bg-red-600 ${
                    editMode ? "hidden" : "block"
                  }`}
                >
                  Edit Profile
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded hover:bg-red-600 ${
                    editMode ? "block" : "hidden"
                  }`}
                >
                  Submit
                </button>
              </div>
            </div>
          ) : (
            <div class='flex space-x-2 justify-center items-center bg-white h-screen dark:invert'>
            <span class='sr-only'>Loading...</span>
             <div class='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]'></div>
           <div class='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]'></div>
           <div class='h-8 w-8 bg-black rounded-full animate-bounce'></div>
         </div>
          )}
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Profile;