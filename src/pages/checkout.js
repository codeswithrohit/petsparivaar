import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import Link from 'next/link';
import { firebase } from "../Firebase/config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
const Checkout = ({ cart, clearCart, subTotal,removeFromCart }) => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const [petName, setPetName] = useState('');
  const [petAge, setPetAge] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [vaccinated, setVaccinated] = useState(false);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        fetchUserData(authUser.uid);
      } else {
        setUser(null);
        router.push('/petkeepersignin');
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
      } else {
        // Redirect to petkeepersignin if userData not found
        router.push('/petkeepersignin');
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };


  useEffect(() => {
    if (petName.length > 2 && petAge.length > 0 && medicalHistory.length > 3) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [petName, petAge, medicalHistory]);
  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'petName':
        setPetName(value);
        break;
      case 'petAge':
        setPetAge(value);
        break;
      case 'medicalHistory':
        setMedicalHistory(value);
        break;
      case 'vaccinated':
        setVaccinated(checked);
        break;
      default:
        break;
    }

    if (name && email) {
      setDisabled(false);
    }
  };

  const initiatePayment = async () => {
    setIsLoading(true);
    let oid = Math.floor(Math.random() * Date.now());

    // Get a transaction token
    const data = {  
      subTotal,
      oid,
      email: userData?.email,
      name: userData?.name,
      cart,
      phoneNumber: userData?.phoneNumber,
      flatHouse: userData?.flatHouse,
      locality: userData?.locality,
      location: userData?.location,
      pincode: userData?.pincode,
      petDetails: {
        petName,
        petAge,
        medicalHistory,
        vaccinated
      }
    };
    let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pretransaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    let txnRes = await a.json();
    if (txnRes.success) {
      let txnToken = txnRes.txnToken;

      var config = {
        "root": "",
        "flow": "DEFAULT",
        "data": {
          "orderId": oid,
          "token": txnToken,
          "tokenType": "TXN_TOKEN",
          "amount": subTotal
        },
        "handler": {
          "notifyMerchant": function (eventName, data) {
            console.log("notifyMerchant handler function called");
            console.log("eventName => ", eventName);
            console.log("data => ", data);
          }
        }
      };

      window.Paytm.CheckoutJS.init(config).then(function onSuccess() {
        window.Paytm.CheckoutJS.invoke();
        setIsLoading(false);
      }).catch(function onError(error) {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
      if (txnRes.cartClear) {
        clearCart();
      }
      toast.error(txnRes.error, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  return (
    <div className='container m-auto min-h-screen'>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Head>
        <title>checkout</title>
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" />
        <link rel="icon" href="/icon.png" />
      </Head>
      <Script type="application/javascript" crossorigin="anonymous" src={`${process.env.NEXT_PUBLIC_PAYTM_HOST}/merchantpgpui/checkoutjs/merchants/${process.env.NEXT_PUBLIC_PAYTM_MID}.js`} />
      <div class="font-[sans-serif] bg-white p-4">
      <div class="max-w-4xl mx-auto">
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-[#333] inline-block border-b-4 border-[#333] pb-1">Checkout</h2>
        </div>
        <div class="mt-12">
        <div class="grid md:grid-cols-3 gap-6">
            <div>
              <h3 class="text-xl font-bold text-[#333]">01</h3>
              <h3 class="text-xl font-bold text-[#333]">Personal Details</h3>
            </div>
            <div class="md:col-span-2">
              <form>
                <div class="grid sm:grid-cols-2 gap-5">
                  <input  value={userData?.name}  type="text" id="name" name="name" placeholder="Name"
                    class="px-4 py-3.5 bg-white text-[#333] w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none" />

                  <input value={userData?.email} readOnly type="email" id="email" name="email" placeholder="Email address"
                    class="px-4 py-3.5 bg-white text-[#333] w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none" />
                  <input value={userData?.phoneNumber} type="number" placeholder="Phone number"
                    class="px-4 py-3.5 bg-white text-[#333] w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none" />
                </div>
              </form>
            </div>
          </div>
          <div class="grid md:grid-cols-3 gap-6 mt-12">
            <div>
              <h3 class="text-xl font-bold text-[#333]">02</h3>
              <h3 class="text-xl font-bold text-[#333]">Your Address</h3>
            </div>
            <div class="md:col-span-2">
              <form>
                <div class="grid sm:grid-cols-2 gap-5">
                <input type="text" value={userData?.flatHouse} placeholder="Flat House" class="px-4 py-3.5 bg-white text-[#333] w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none" />
                    <input type="text" value={userData?.landmark} placeholder="LandMark" class="px-4 py-3.5 bg-white text-[#333] w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none" />
                    <input type="text" value={userData?.locality} placeholder="Locality" class="px-4 py-3.5 bg-white text-[#333] w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none" />
                    <input type="text" value={userData?.location} placeholder="Location" class="px-4 py-3.5 bg-white text-[#333] w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none" />
                    <input type="number" value={userData?.pincode} placeholder="Pin Code" class="px-4 py-3.5 bg-white text-[#333] w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none" />
                </div>
              </form>
            </div>
          </div>
          <div class="grid md:grid-cols-3 gap-6 mt-12">
            <div>
              <h3 class="text-xl font-bold text-[#333]">03</h3>
              <h3 class="text-xl font-bold text-[#333]">Enter Your Pet Details</h3>
            </div>
            <div class="md:col-span-2">
            <form>
                  <div class="grid sm:grid-cols-2 gap-5">
                    <input type="text" placeholder="Pet Name" name="petName" value={petName} onChange={handleChange} class="px-4 py-3.5 bg-white text-[#333] w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none" />
                    <input type="text" placeholder="Pet Age" name="petAge" value={petAge} onChange={handleChange} class="px-4 py-3.5 bg-white text-[#333] w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none" />
                    <textarea placeholder="Medical History" name="medicalHistory" value={medicalHistory} onChange={handleChange} class="px-4 py-3.5 bg-white text-[#333] w-full h-24 text-sm border-2 rounded-md focus:border-blue-500 outline-none" />
                    <div>
                      <input type="checkbox" id="vaccinated" name="vaccinated" checked={vaccinated} onChange={handleChange} class="mr-2" />
                      <label for="vaccinated" class="text-[#333] text-sm">Vaccinated</label>
                    </div>
                  </div>
                </form>
            </div>
          </div>
          <div class="grid md:grid-cols-3 gap-6 mt-12">
            <div>
              <h3 class="text-xl font-bold text-[#333]">04</h3>
              <h3 class="text-xl font-bold text-[#333]">Order Summary</h3>
            </div>
            <div class="md:col-span-2">
  {userData && userData.pets && userData.pets.length > 0 && (
   <div className="overflow-x-auto">
   <h2 className="text-lg font-semibold mb-4 mt-4">Pets Keeper Details</h2>
   <table className="min-w-full divide-y divide-gray-200">
     <thead className="bg-gray-50">
       <tr>
         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
           Pet keeper Info
         </th>
         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
           Check In - Check Out
         </th>
         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
           Price
         </th>
         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
           Actions
         </th>
       </tr>
     </thead>
     <tbody className="bg-white divide-y divide-gray-200">
       {/* Iterate through items in the cart */}
       {Object.values(cart).map((item, index) => (
         <tr key={index}>
           <td className="px-6 py-4 whitespace-nowrap">
             <div className="text-xs text-gray-900">
               {`${item.type}, ${item.service}, ${item.name}, ${item.location}`}
             </div>
           </td>
           <td className="px-6 py-4 whitespace-nowrap">
             <div className="text-sm text-gray-900">{`${item.PetDate}`}</div>
           </td>
           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{`₹${item.price * item.qty}`}</td>
           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
             <button
               onClick={() => {
                 removeFromCart(1, item.price, item.name);
               }}
               className="py-2 px-4 rounded bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:bg-red-600"
             >
               Remove
             </button>
           </td>
         </tr>
       ))}
     </tbody>
   </table>
 </div>
 

)}
            </div>
          </div>
         
        
          <div class="flex flex-wrap justify-end gap-4 mt-12">
          {isLoading ? (
          <div className='mx-4'>
          <button  className="disabled:bg-indigo-300 px-6 py-3.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Loading...</button>
        </div>
        ) : (
      <div className='mx-4'>
        <Link href={'/checkout'}><button disabled={disabled} onClick={initiatePayment} className=" disabled:bg-indigo-300 px-6 py-3.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Pay ₹{subTotal}</button></Link>
      </div>)}

          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Checkout