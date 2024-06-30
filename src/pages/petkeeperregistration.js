import React, { useState, useEffect,useRef } from 'react';
import { firebase } from '../Firebase/config';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import Spinner from '../components/Spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
const placesLibrary = ['places'];
const StepWiseRegistrationForm = () => {
  const [verificationstep, setVerificationstep] = useState(1);
  const [verificationId, setVerificationId] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [verifiedPhoneNumber, setVerifiedPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [Location, setLocation] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    verificationCode: '',
    flatHouse: '',
    locality: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    pets: [], // Array to store pet information
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to handle adding pets
  const handleAddPet = () => {
    setFormData({
      ...formData,
      pets: [...formData.pets, { type: '', options: '', price: '' }],
    });
  };

  // Function to handle updating pet information
  const handlePetInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPets = [...formData.pets];
    updatedPets[index][name] = value;
    setFormData({ ...formData, pets: updatedPets });
  };

  // Function to remove a pet
  const handleRemovePet = (index) => {
    const updatedPets = [...formData.pets];
    updatedPets.splice(index, 1);
    setFormData({ ...formData, pets: updatedPets });
  };




 

  const handleSendCode = () => {
    setIsLoading(true); // Set loading state to true
    
    const recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'send-code-button',
      {
        size: 'invisible',
      }
    );
  
    const phoneNumberWithPrefix = '+91' + formData.phoneNumber; // Concatenate +91 with formData.phoneNumber
    
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumberWithPrefix, recaptchaVerifier) // Use phoneNumberWithPrefix
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
        setVerificationstep(2);
        setIsLoading(false); // Reset loading state
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false); // Reset loading state in case of error
      });
  };
  
  

  const handleVerifyCode = () => {
    setIsLoading(true); // Set loading state to true
  
    const credential = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      formData.verificationCode
    );
  
    firebase
      .auth()
      .signInWithCredential(credential)
      .then((userCredential) => {
        setIsLoading(false); // Reset loading state
        setIsVerified(true);
        setVerifiedPhoneNumber(formData.phoneNumber);
        setVerificationstep(3);
        toast.success('OTP verified successfully.'); // Show success message
      })
      .catch((error) => {
        setIsLoading(false); // Reset loading state
        console.error(error);
        toast.error('Incorrect OTP. Please enter correct OTP.'); // Show error message
      });
  };
  

  useEffect(() => {
    // Check if the user is already verified (e.g., page refreshed)
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user && user.phoneNumber === verifiedPhoneNumber) {
        setIsVerified(true);
        setVerificationstep(3);
      }
    });

    return () => unsubscribe();
  }, [verifiedPhoneNumber]);

 

  const router = useRouter();

  
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyB6gEq59Ly20DUl7dEhHW9KgnaZy4HrkqQ',
    libraries: placesLibrary,
  });
 

  const autocompleteRef = useRef();



  const onLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };
  




  const onPlaceChanged = () => {
    const autocomplete = autocompleteRef.current;
  
    if (autocomplete && autocomplete.getPlace) {
      const place = autocomplete.getPlace();
  
      if (place && place.formatted_address) {
        setLocation(place.formatted_address); // Update to set the full formatted address
      }
    }
  };
  
  const handleSignUpWithEmailPassword = async () => {
    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password);
      const user = userCredential.user;
  
      // Check if a user with the same email already exists
      if (user) {
        // Store additional user data in Firestore (if needed)
        const firestore = firebase.firestore();
        const userRef = firestore.collection('petkeeper').doc(user.uid);
  
        const userData = {
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          flatHouse: formData.flatHouse,
          locality: formData.locality,
          location: Location,
          pincode: formData.pincode,
          landmark: formData.landmark,
          ispetkeeper: 'true',
          Verified: 'False',
          pets: formData.pets // Include pets details here
        };
  
        await userRef.set(userData);
  
        setIsLoading(false);
        toast.success('Account created successfully.');
        router.push('/PetKeeper/signin'); // Redirect to the sign-in page
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.error('Error creating the account.');
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if all required fields are filled
    if (
      formData.name &&
      formData.email &&
      formData.password && // Check for password
      formData.phoneNumber &&
      formData.flatHouse &&
      formData.locality &&
      formData.pincode &&
      formData.landmark &&
      formData.pets
    ) {
      if (!isVerified) {
        toast.warning('Please verify your mobile number.');
        return;
      }
    } else {
      toast.warning('Please fill in all required fields.');
      return;
    }
  
    // Show loading message while submitting data
    setIsLoading(true);
  
    // Check if a user with the same email already exists
    const userExists = await checkUserExists(formData.email);
    if (userExists) {
      setIsLoading(false);
      toast.error('Email already exists.');
      return;
    }
  
    const mobileNumberExists = await checkMobileNumberExists(formData.phoneNumber);
  
    if (mobileNumberExists) {
      setIsLoading(false);
      toast.error('Mobile number already exists Please try with different mobile number.');
      window.location.reload(); // Refresh the page
      return;
    }
  
    // Sign up with email and password
    handleSignUpWithEmailPassword();
  };
  

  const checkUserExists = async (email) => {
    const petkeeperRef = firebase.firestore().collection('petkeeper');
    const snapshot = await petkeeperRef.where('email', '==', email).get();
    return !snapshot.empty;
  };
  const checkMobileNumberExists = async (phoneNumber) => {
    const petkeeperRef = firebase.firestore().collection('petkeeper');
    const snapshot = await petkeeperRef.where('phoneNumber', '==', phoneNumber).get();
    return !snapshot.empty;
  };
  
  if (!isLoaded) {
    return (
      <div className='flex min-h-screen justify-center item-center'>
        <Spinner />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-xl">
       
        <form
          id="registrationForm"
          className="bg-white rounded p-6 mb-8"
          onSubmit={handleSubmit}
        >
          {/* Step 1: Personal Information */}
          <>
             <div class="flex mb-4 items-items justify-center max-md:flex-col gap-y-6 gap-x-2 max-w-screen-lg mx-auto px-4 font-[sans-serif] mt-4">
      <div class="overflow-hidden min-w-[250px] pr-[35px]">
        <div class="bg-[#4f46e5] h-[60px] py-2.5 px-6 rounded-md relative after:bg-[#4f46e5] after:absolute after:h-[60px] after:w-[60px] after:top-0 after:-right-4 after:rotate-[46deg] after:rounded-sm">
          <div class="relative z-10">
            <h4 class="text-base font-bold text-white">Pet Keeper Registration</h4>
            <p class="text-xs text-gray-300">Step Inputs here</p>
          </div>
        </div>
      </div>
    
    </div>
              
              <div class="flex items-center justify-center ">
  
    <div class="mx-auto w-full max-w-[550px] bg-white">
     
            <div class="-mx-3 flex flex-wrap">
              <div class="w-full px-3 sm:w-1/2">
                    <div class="mb-2">
                        <label for="fName" class="mb-3 block text-base font-medium text-[#07074D]">
                             Name
                        </label>
                        <input  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                            class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#f97316] focus:shadow-md" />
                    </div>
                </div>
              <div class="w-full px-3 sm:w-1/2">
                    <div class="mb-2">
                        <label for="email" class="mb-3 block text-base font-medium text-[#07074D]">
                             Email
                        </label>
                        <input   type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                            class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#f97316] focus:shadow-md" />
                    </div>
                </div>
              <div class="w-full px-3 sm:w-1/2">
                    <div class="mb-2">
                        <label for="password" class="mb-3 block text-base font-medium text-[#07074D]">
                           Password
                        </label>
                        <input      type="password"
                  name="password"
                  placeholder="Enter Paswword"
                  value={formData.password}
                  onChange={handleInputChange}
                            class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#f97316] focus:shadow-md" />
                    </div>
                </div>
           
              <div className="mb-2">
                {isVerified ? (
                  <div>
                    {verificationstep === 3 && (
                      <div>
                      {verificationstep === 3 && (
                        <div>
                           <div class="w-full px-3 ">
                      <div class="mb-2">
                          <label for="phoneNumber" class="mb-3 block text-base font-medium text-[#07074D]">
                             Mobile Number
                          </label>
                          <input       type="tel"
                              name="phoneNumber"
                              placeholder="Mobile Number"
                              value={verifiedPhoneNumber}
                              readOnly
                              class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#f97316] focus:shadow-md" />
                      </div>
                  </div>
              <h1 className='text-xs text-green-700 ml-4' >Your Mobile Number is Verified Successfully</h1>
                        </div>
                      )}
                    </div>
                    )}
                  </div>
                ) : verificationId ? (
                  <>
                    {verificationstep === 2 && (
                    
                      <div class="w-full px-3 ">
                      <div class="mb-2">
                          <label for="phoneNumber" class="mb-3 block text-base font-medium text-[#07074D]">
                           Enter  OTP
                          </label>
                          <input       type="text"
                          name="verificationCode"
                          placeholder="Enter OTP"
                          value={formData.verificationCode}
                          onChange={handleInputChange}
                              class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#f97316] focus:shadow-md" />
                      </div>
                  </div>
                    )}
                    <button
  type="button"
  className={`w-36 tracking-wide font-semibold bg-green-500 text-gray-100 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none ${
    isLoading ? 'cursor-not-allowed opacity-50' : ''
  }`}
  onClick={handleVerifyCode}
  disabled={isLoading} // Disable button while loading
>
  {isLoading ? (
    <>
      <svg
        className="animate-spin h-5 w-5 mr-3"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.004 8.004 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM12 20c1.856 0 3.552-.633 4.891-1.688l-3-2.647A4.002 4.002 0 0012 16v4zm7-7.709V12a8.002 8.002 0 01-2.938 6.188l3 2.647c1.866-2.114 3-4.896 3-7.938h-4z"
        ></path>
      </svg>
      <span>Verifying...</span>
    </>
  ) : (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
      </svg>
      <span className="ml-3">Verify</span>
    </>
  )}
</button>

                  </>
                ) : (
                  <>
                    {verificationstep === 1 && (
                      <>
                         <div class="w-full px-3 ">
                    <div class="mb-2">
                        <label for="phoneNumber" class="mb-3 block text-base font-medium text-[#07074D]">
                           Mobile Number
                        </label>
                        <input       type="tel"
                            name="phoneNumber"
                            placeholder="Mobile Number"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#f97316] focus:shadow-md" />
                    </div>
                </div>
                <button
  type="button"
  id="send-code-button"
  onClick={handleSendCode}
  className={`w-36 tracking-wide font-semibold bg-green-500 text-gray-100 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none ${
    isLoading ? 'cursor-not-allowed opacity-50' : ''
  }`}
  disabled={isLoading}
>
  {isLoading ? (
    <>
      <svg
        className="animate-spin h-5 w-5 mr-3"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.004 8.004 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM12 20c1.856 0 3.552-.633 4.891-1.688l-3-2.647A4.002 4.002 0 0012 16v4zm7-7.709V12a8.002 8.002 0 01-2.938 6.188l3 2.647c1.866-2.114 3-4.896 3-7.938h-4z"
        ></path>
      </svg>
      <span>Sending...</span>
    </>
  ) : (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
      </svg>
      <span className="ml-3">Send Code</span>
    </>
  )}
</button>

                       
                       
                      </>
                    )}
                  </>
                )}
              </div>
              <div class="w-full px-3 sm:w-1/2">
                    <div class="mb-2">
                        <label for="flatHouse" class="mb-3 block text-base font-medium text-[#07074D]">
                        Flat/House #
                        </label>
                        <input      type="text"
                    name="flatHouse"
                    placeholder="Flat/House #"
                    value={formData.flatHouse}
                    onChange={handleInputChange}
                            class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#f97316] focus:shadow-md" />
                    </div>
                </div>
             
              <div class="w-full px-3 sm:w-1/2">
                    <div class="mb-2">
                        <label for="locality" class="mb-3 block text-base font-medium text-[#07074D]">
                       Locality
                        </label>
                        <input 
                     type="text"
                     name="locality"
                     placeholder="Locality"
                     value={formData.locality}
                     onChange={handleInputChange}
                            class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#f97316] focus:shadow-md" />
                    </div>
                </div>
                <div class="w-full px-3 ">
                    <div class="mb-2">
                        <label for="location" class="mb-3 block text-base font-medium text-[#07074D]">
                      Search Location
                        </label>
                        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                        <input 
                       type="text"
                       value={Location}
                       onChange={(e) => setLocation(e.target.value)}
                       placeholder="Search Location"
                            class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#f97316] focus:shadow-md" />
                            </Autocomplete>
                    </div>
                </div>
             
            
                <div class="w-full px-3 sm:w-1/2">
                    <div class="mb-2">
                        <label for="pincode" class="mb-3 block text-base font-medium text-[#07074D]">
                       Pincode
                        </label>
                        <input 
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                            class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#f97316] focus:shadow-md" />
                    </div>
                </div>
                <div class="w-full px-3 sm:w-1/2">
                    <div class="mb-2">
                        <label for="landmark" class="mb-3 block text-base font-medium text-[#07074D]">
                       Landmark
                        </label>
                        <input 
                   type="text"
                   name="landmark"
                   placeholder="Landmark"
                   value={formData.landmark}
                   onChange={handleInputChange}
                            class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#f97316] focus:shadow-md" />
                    </div>
                </div>
                <div className="mb-4">
                <div className="mt-4">
  <button
    type="button"
    className="border border-transparent bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-lg"
    onClick={handleAddPet}
  >
    Add Pet
  </button>
  {/* Inputs for each pet */}
  {formData.pets.map((pet, index) => (
    <div key={index} className="mt-4 flex items-center">
      {/* Select pet type */}
      <div className="w-1/3">
        <label htmlFor={`petType${index}`} className="block mb-2 font-medium text-[#07074D]">
          Pet Type
        </label>
        <select
          id={`petType${index}`}
          name="type"
          value={pet.type}
          onChange={(e) => handlePetInputChange(index, e)}
          className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-4 text-base text-[#6B7280] outline-none focus:border-[#f97316] focus:shadow-md"
        >
          <option value="">Select Pet Type</option>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
          <option value="Other">Other</option>
        </select>
      </div>
      {/* Select pet service */}
      <div className="w-1/3 ml-4">
        <label htmlFor={`petService${index}`} className="block mb-2 font-medium text-[#07074D]">
          Pet Service
        </label>
        <select
          id={`petService${index}`}
          name="service"
          value={pet.service}
          onChange={(e) => handlePetInputChange(index, e)}
          className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-4 text-base text-[#6B7280] outline-none focus:border-[#f97316] focus:shadow-md"
        >
          <option value="">Select Pet Service</option>
          <option value="Boarding">Boarding</option>
          <option value="Sitting">Sitting</option>
          <option value="Care">Care</option>
        </select>
      </div>
      {/* Input for price */}
      <div className="w-1/3 ml-4">
        <label htmlFor={`petPrice${index}`} className="block mb-2 font-medium text-[#07074D]">
          Price Per/day
        </label>
        <input 
          id={`petPrice${index}`}
          type="text"
          name="price"
          placeholder="Price"
          value={pet.price}
          onChange={(e) => handlePetInputChange(index, e)}
          className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-4 text-base text-[#6B7280] outline-none focus:border-[#f97316] focus:shadow-md"
        />
      </div>
      {/* Button to remove pet */}
      <button
        type="button"
        className="border border-transparent bg-red-600 hover:bg-red-700 text-white py-2 px-2 rounded-lg mt-6 ml-2 text-xs"
        onClick={() => handleRemovePet(index)}
      >
        Remove
      </button>
    </div>
  ))}
</div>

            </div>
         
             

</div>
</div>
</div>
            </>

        

          <div className="form-footer flex justify-between mt-6">
           
          <button
  type="button"
  className={`flex-1 border ml-8 border-transparent focus:outline-none p-3 rounded-lg text-center text-white bg-green-600 hover:bg-greeen-700 text-lg`}
  onClick={handleSubmit}
  disabled={isLoading}
>
  {isLoading ? 'Loading...' : 'Submit'}
</button>

          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default StepWiseRegistrationForm;
