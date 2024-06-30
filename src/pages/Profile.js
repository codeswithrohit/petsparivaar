import { FaUser } from "react-icons/fa";
import { useState, useEffect } from "react";
import { firebase } from "../Firebase/config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // New state for submission status
  const [newPet, setNewPet] = useState({ type: "", vaccinated: false, medicalHistory: "", age: "", breed: "" });

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
      const userDoc = await firebase.firestore().collection("petparents").doc(uid).get();
      if (userDoc.exists) {
        const fetchedUserData = userDoc.data();
        setUserData(fetchedUserData);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  const handleAddPet = () => {
    setUserData({
      ...userData,
      pets: [...(userData.pets || []), newPet],
    });
    setNewPet({ type: "", vaccinated: false, medicalHistory: "", age: "", breed: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); // Set submitting to true
    try {
      await firebase.firestore().collection("petparents").doc(user.uid).update({
        pets: userData.pets,
      });
      toast.success("Profile Updated Successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Error updating profile");
    } finally {
      setSubmitting(false); // Set submitting to false
    }
  };

  return (
    <div>
      <div className="flex flex-col font-sans py-10 md:flex-row min-h-screen bg-gray-white">
        <div className="font-[sans-serif] m-6 max-w-4xl mx-auto">
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

              <div className="grid sm:grid-cols-2 gap-10">
                <div className="relative flex items-center">
                  <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter first name"
                    value={userData.name}
                    readOnly
                    className="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-blue-500 rounded outline-none"
                  />
                </div>
                <div className="relative flex items-center">
                  <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                    Phone No
                  </label>
                  <input
                    type="number"
                    placeholder="Enter phone no."
                    value={userData.phoneNumber}
                    readOnly
                    className="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-blue-500 rounded outline-none"
                  />
                </div>
                <div className="relative flex items-center sm:col-span-2">
                  <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={userData.email}
                    readOnly
                    className="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-blue-500 rounded outline-none"
                  />
                </div>
                <div className="relative flex items-center">
                  <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                    Flat House
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Flat House"
                    value={userData.flatHouse}
                    readOnly
                    className="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-blue-500 rounded outline-none"
                  />
                </div>
                <div className="relative flex items-center">
                  <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                    Locality
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Locality"
                    value={userData.locality}
                    readOnly
                    className="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-blue-500 rounded outline-none"
                  />
                </div>
                <div className="relative flex items-center">
                  <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                    Landmark
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Landmark"
                    value={userData.landmark}
                    readOnly
                    className="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-blue-500 rounded outline-none"
                  />
                </div>
                <div className="relative flex items-center">
                  <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                    Pincode
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Pincode"
                    value={userData.pincode}
                    readOnly
                    className="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-blue-500 rounded outline-none"
                  />
                </div>
                <div className="relative flex items-center sm:col-span-2">
                  <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Location"
                    value={userData.location}
                    readOnly
                    className="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-blue-500 rounded outline-none"
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
                            <div className="text-sm text-gray-900">{pet.vaccinated ? "Yes" : "No"}</div>
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

              <div className="my-4">
                <h2 className="text-lg font-semibold mb-4 mt-4">Add Pet Details</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="relative flex items-center">
                    <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                      Type
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Pet Type"
                      value={newPet.type}
                      onChange={(e) => setNewPet({ ...newPet, type: e.target.value })}
                      className="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-blue-500 rounded outline-none"
                    />
                  </div>
                  <div className="relative flex items-center">
                    <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                      Vaccinated
                    </label>
                    <select
                      value={newPet.vaccinated}
                      onChange={(e) => setNewPet({ ...newPet, vaccinated: e.target.value === "true" })}
                      className="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-blue-500 rounded outline-none"
                    >
                      <option value={true}>Yes</option>
                      <option value={false}>No</option>
                    </select>
                  </div>
                  <div className="relative flex items-center sm:col-span-2">
                    <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                      Medical History
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Medical History"
                      value={newPet.medicalHistory}
                      onChange={(e) => setNewPet({ ...newPet, medicalHistory: e.target.value })}
                      className="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-blue-500 rounded outline-none"
                    />
                  </div>
                  <div className="relative flex items-center">
                    <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                      Age
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Age"
                      value={newPet.age}
                      onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
                      className="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-blue-500 rounded outline-none"
                    />
                  </div>
                  <div className="relative flex items-center">
                    <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                      Breed
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Breed"
                      value={newPet.breed}
                      onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
                      className="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-blue-500 rounded outline-none"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddPet}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Add Pet
                </button>
              </div>

              <div className="flex justify-center">
                <button onClick={handleSubmit} className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md">
                  {submitting ? "Submitting..." : "Submit"} {/* Show submitting text */}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-80">
              {loading ? <p>Loading...</p> : <p>No user data available.</p>}
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Profile;
