import { useEffect, useState } from "react";
import { getFirestore, updateDoc, doc } from "firebase/firestore";
import { firebase } from "../../Firebase/config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const PetKeepers = () => {
    const [petkeeper, setPetkeeper] = useState([]);
    const [loading, setLoading] = useState(true); // State for loading spinner
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const userRef = firebase.firestore().collection("petkeeper");
          const querySnapshot = await userRef.get();
  
          const fetchedpetkeeper = [];
          querySnapshot.forEach((doc) => {
            // Extract data for each document
            const data = doc.data();
            fetchedpetkeeper.push({ ...data, id: doc.id });
          });
  
          setPetkeeper(fetchedpetkeeper);
          setLoading(false); // Data fetched, set loading to false
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
  
      fetchData();
    }, []);
    const handleVerificationChange = async (id, newValue) => {
        try {
            const docRef = doc(firebase.firestore(), "petkeeper", id);
            await updateDoc(docRef, {
                Verified: newValue
            });
            
      toast.success("Status changed successfully!");
      setTimeout(() => window.location.reload(), 2000);
        } catch (error) {
            console.error("Error updating verification status:", error);
            toast.error("An error occurred while changing the status.");
        }
    };

    return (
        <div>
            <div className="lg:ml-64 md:mt-0 mt-16">
                <h1 className="mb-3 block text-base font-medium text-[#07074D] text-center">Pet Keeper Details</h1>
                {loading ? ( // Conditional rendering for loading spinner
          <div className="flex justify-center items-center h-32">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
          </div>
        ) : (
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200 font-[sans-serif]">
                        <thead class="bg-gray-100 whitespace-nowrap">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mobile Number
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Location
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Verified
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Pets
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200 whitespace-nowrap">
                            {petkeeper.map((keeper, index) => (
                                <tr key={keeper.id}>
                                    <td class="px-6 py-4 text-sm text-[#333]">{keeper.name}</td>
                                    <td class="px-6 py-4 text-sm text-[#333]">{keeper.email}</td>
                                    <td class="px-6 py-4 text-sm text-[#333]">{keeper.phoneNumber}</td>
                                    <td class="px-6 py-4 text-sm text-[#333]">
                                        {keeper.flatHouse},{keeper.landmark},{keeper.locality}, {keeper.location}
                                    </td>
                                    <td class="px-6 py-4 text-sm text-[#333]">
                                        <select
                                            value={keeper.Verified}
                                            onChange={(e) => handleVerificationChange(keeper.id, e.target.value)}
                                            className=" border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="True">Verified</option>
                                            <option value="False">Unverified</option>
                                        </select>
                                    </td>
                                    <td class="px-6 py-4 text-sm text-[#333]">
                                        <ul>
                                            {keeper.pets.map((pet, petIndex) => (
                                                <li key={petIndex}>
                                                    <span>{petIndex + 1}.</span> Pet Type: {pet.type}, Service: {pet.service}, Price: {pet.price}/per day
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
            </div>
            <ToastContainer/>
        </div>
    );
};

export default PetKeepers;
