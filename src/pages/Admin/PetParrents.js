import { useEffect, useState } from "react";
import { firebase } from "../../Firebase/config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Petparents = () => {
  const [petparents, setPetParents] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading spinner

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRef = firebase.firestore().collection("petparents");
        const querySnapshot = await userRef.get();

        const fetchedPetParents = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedPetParents.push({ ...data, id: doc.id });
        });

        setPetParents(fetchedPetParents);
        setLoading(false); // Data fetched, set loading to false
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  console.log(petparents);

  return (
    <div className="lg:ml-64 md:mt-0 mt-16">
      <h1 className="mb-3 block text-base font-medium text-[#07074D] text-center">
        Pet Parents Details
      </h1>
      {loading ? ( // Conditional rendering for loading spinner
        <div className="flex justify-center items-center h-32">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 font-[sans-serif]">
            <thead className="bg-gray-100 whitespace-nowrap">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mobile Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pets
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 whitespace-nowrap">
              {petparents.map((parent) => (
                <tr key={parent.id}>
                  <td className="px-6 py-4 text-sm text-[#333]">{parent.name}</td>
                  <td className="px-6 py-4 text-sm text-[#333]">{parent.email}</td>
                  <td className="px-6 py-4 text-sm text-[#333]">{parent.phoneNumber}</td>
                  <td className="px-6 py-4 text-sm text-[#333]">
                    {parent.flatHouse}, {parent.landmark}, {parent.locality}, {parent.location}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#333]">
                    <ul>
                      {parent.pets.map((pet, petIndex) => (
                        <li key={petIndex} className="mb-2">
                          <div className="font-semibold"> {petIndex + 1}:</div>
                          <div className="ml-2">
                            <div>Type: {pet.type}</div>
                            <div>Breed: {pet.breed}</div>
                            <div>Age: {pet.age}</div>
                            <div>Medical History: {pet.medicalHistory}</div>
                            <div>Pet Name: {pet.petName}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Petparents;
