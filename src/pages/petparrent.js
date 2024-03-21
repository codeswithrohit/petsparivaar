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
  const [currentStep, setCurrentStep] = useState(1);
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
    numberOfPets: '',
    pets: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  

  const handlePetInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedPets = [...formData.pets];
    updatedPets[index][name] = value;
    setFormData({ ...formData, pets: updatedPets });
  };

  const handlePetTypeChange = (e, index) => {
    const { value } = e.target;
    const updatedPets = [...formData.pets];
    updatedPets[index].type = value;
    setFormData({ ...formData, pets: updatedPets });
  };

  const addPet = () => {
    const updatedPets = [...formData.pets, {}];
    setFormData({ ...formData, pets: updatedPets });
  };

  const removePet = (index) => {
    const updatedPets = [...formData.pets];
    updatedPets.splice(index, 1);
    setFormData({ ...formData, pets: updatedPets });
  };

  const renderPetBreedDropdown = (pet, index) => {
    if (pet.type === 'dog') {
      return (
        <div class="w-full px-3 mt-4 md:mt-10 m sm:w-1/2">
        <div class="mb-2">
<select
  name="breed"
  value={pet.breed}
  onChange={(e) => handlePetInputChange(e, index)}
class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#f97316] focus:shadow-md"
>
<option value="">Select Dog Breed</option>
          <option value="Labrador">Labrador</option>
          <option value="Golden Retriever">Golden Retriever</option>
          <option value="German Shepherd">German Shepherd</option>
          <option value="Beagle">Beagle</option>
          <option value="Rottweiler">Rottweiler</option>
</select>
</div>
</div>
    
      );
    } else if (pet.type === 'cat') {
      return (
        <div class="w-full px-3 mt-4 md:mt-10 m sm:w-1/2">
        <div class="mb-2">
<select
    name="breed"
    value={pet.breed}
    onChange={(e) => handlePetInputChange(e, index)}
class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#f97316] focus:shadow-md"
>
<option value="">Select Cat Breed</option>
          <option value="Persian">Persian</option>
          <option value="Himalayan">Himalayan</option>
          <option value="Siamese">Siamese</option>
          <option value="Burmese">Burmese</option>
</select>
</div>
</div>
       
      );
    } else {
      return (
        <div class="w-full px-3 sm:w-1/2">
        <div class="mb-2">
            <label for="petNamefName" class="mb-3 block text-base font-medium text-[#07074D]">
                 Pet Breed Name
            </label>
            <input    type="text"
          name="breed"
          placeholder="Pet Breed"
          value={pet.breed}
          onChange={(e) => handlePetInputChange(e, index)}
                class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#f97316] focus:shadow-md" />
        </div>
    </div>
       
      );
    }
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

  const handleNext = () => {
    if (currentStep === 1 && formData.numberOfPets > 0) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(2);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

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
        const userRef = firestore.collection('petparents').doc(user.uid);

        const userData = {
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          flatHouse: formData.flatHouse,
          locality: formData.locality,
        location:Location,
          pincode: formData.pincode,
          landmark: formData.landmark,
          pets: formData.pets,
          isPetaprrent:'true',
        };

        await userRef.set(userData);

        setIsLoading(false);
        toast.success('Account created successfully.');
        router.push('/signin'); // Redirect to the sign-in page
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.error('Error creating the account.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentStep === 1) {
      // Existing code for phone number verification
    } else if (currentStep === 2) {
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
        formData.numberOfPets > 0
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
        toast.error('Mobile number already exists.');
        window.location.reload(); // Refresh the page
        return;
      }
      
  

      // Sign up with email and password
      handleSignUpWithEmailPassword();
    }

    handleNext();
  };

  const checkUserExists = async (email) => {
    const petparentsRef = firebase.firestore().collection('petparents');
    const snapshot = await petparentsRef.where('email', '==', email).get();
    return !snapshot.empty;
  };
  const checkMobileNumberExists = async (phoneNumber) => {
    const petparentsRef = firebase.firestore().collection('petparents');
    const snapshot = await petparentsRef.where('phoneNumber', '==', phoneNumber).get();
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
        <h1 className="text-3xl font-bold text-[#f97316] text-center mt-4">
          Pet Parrent Registration
        </h1>
        <form
          id="registrationForm"
          className="bg-white rounded p-6 mb-8"
          onSubmit={handleSubmit}
        >
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <>
             <div class="flex mb-4 items-items justify-center max-md:flex-col gap-y-6 gap-x-2 max-w-screen-lg mx-auto px-4 font-[sans-serif] mt-4">
      <div class="overflow-hidden min-w-[250px] pr-[35px]">
        <div class="bg-[#f97316] h-[60px] py-2.5 px-6 rounded-md relative after:bg-[#f97316] after:absolute after:h-[60px] after:w-[60px] after:top-0 after:-right-4 after:rotate-[46deg] after:rounded-sm">
          <div class="relative z-10">
            <h4 class="text-base font-bold text-white">Personal Info</h4>
            <p class="text-xs text-gray-300">Step Inputs here</p>
          </div>
        </div>
      </div>
      <div class="overflow-hidden min-w-[250px] pr-[35px]">
        <div class="bg-gray-300 h-[60px] py-2.5 px-6 rounded-md relative after:bg-gray-300 after:absolute after:h-[60px] after:w-[60px] after:top-0 after:-right-4 after:rotate-[46deg] after:rounded-sm">
          <div class="relative z-10">
            <h4 class="text-base font-bold text-gray-500">Pet  Info</h4>
            <p class="text-xs text-gray-500">Step Inputs here</p>
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
                <div class="w-full px-3 sm:w-1/2">
                    <div class="mb-2">
                        <label for="numberOfPets" class="mb-3 block text-base font-medium text-[#07074D]">
                      Number of pets
                        </label>
                        <input 
                  type="number"
                  name="numberOfPets"
                  placeholder="Number of Pets"
                  value={formData.numberOfPets}
                  onChange={handleInputChange}
                            class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#f97316] focus:shadow-md" />
                    </div>
                </div>
             

</div>
</div>
</div>
            </>
          )}

          {/* Step 2: Pet Information */}
          {currentStep === 2 && (
  <>
     <div class="flex mb-4 items-items justify-center max-md:flex-col gap-y-6 gap-x-2 max-w-screen-lg mx-auto px-4 font-[sans-serif] mt-4">
      <div class="overflow-hidden min-w-[250px] pr-[35px]">
        <div class="bg-[#f97316] h-[60px] py-2.5 px-6 rounded-md relative after:bg-[#f97316] after:absolute after:h-[60px] after:w-[60px] after:top-0 after:-right-4 after:rotate-[46deg] after:rounded-sm">
          <div class="relative z-10">
            <h4 class="text-base font-bold text-white">Personal Info</h4>
            <p class="text-xs text-gray-300">Step Inputs here</p>
          </div>
        </div>
      </div>
      <div class="overflow-hidden min-w-[250px] pr-[35px]">
        <div class="bg-[#f97316] h-[60px] py-2.5 px-6 rounded-md relative after:bg-[#f97316] after:absolute after:h-[60px] after:w-[60px] after:top-0 after:-right-4 after:rotate-[46deg] after:rounded-sm">
          <div class="relative z-10">
            <h4 class="text-base font-bold text-white">Pet Info</h4>
            <p class="text-xs text-gray-300">Step Inputs here</p>
          </div>
        </div>
      </div>
    
    </div>
    
    {formData.pets.map((pet, index) => (
     <div key={index} class="flex items-center justify-center">
     <div class="mx-auto w-full max-w-[550px] bg-white">
       <div class="-mx-3 flex flex-wrap">
         <div class="w-full px-3 sm:w-1/2">
           <div class="mb-2">
             <label for="petNamefName" class="mb-3 block text-base font-medium text-[#07074D]">
               Pet Name
             </label>
             <input
               type="text"
               name="petName"
               placeholder="Pet Name"
               value={pet.petName || ''}
               onChange={(e) => handlePetInputChange(e, index)}
               class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#f97316] focus:shadow-md"
             />
           </div>
         </div>
         <div class="w-full px-3 mt-4 md:mt-10 sm:w-1/2">
           <div class="mb-2">
             <select
               name="type"
               value={pet.type || ''}
               onChange={(e) => handlePetTypeChange(e, index)}
               class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#f97316] focus:shadow-md"
             >
               <option value="">Select Pet Type</option>
               <option value="dog">Dog</option>
               <option value="cat">Cat</option>
               <option value="other">Other</option>
             </select>
           </div>
         </div>
         {renderPetBreedDropdown(pet, index)}
         <div class="w-full px-3 sm:w-1/2">
           <div class="mb-2">
             <label for="age" class="mb-3 block text-base font-medium text-[#07074D]">
               Pet Age
             </label>
             <input
               type="number"
               name="age"
               placeholder="Pet Age"
               value={pet.age || ''}
               onChange={(e) => handlePetInputChange(e, index)}
               class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#f97316] focus:shadow-md"
             />
           </div>
         </div>
         <div class="w-full px-3 sm:w-1/2">
           <div class="mb-2">
             <label for="medicalhistory" class="mb-3 block text-base font-medium text-[#07074D]">
               Medical History
             </label>
             <textarea
               name="medicalHistory"
               placeholder="Medical History"
               value={pet.medicalHistory || ''}
               onChange={(e) => handlePetInputChange(e, index)}
               class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#f97316] focus:shadow-md"
             />
           </div>
         </div>
        
       </div>
       <div class="w-full flex px-3 sm:w-1/2">
           <div className="mb-2">
             <label className="text-gray-700 font-medium">
               <input
                 type="checkbox"
                 name="vaccinated"
                 checked={pet.vaccinated || false}
                 onChange={(e) => handlePetInputChange(e, index)}
                 className="mr-2 leading-tight"
               />
               Vaccinated
             </label>
           </div>
           <div>
           <button
             type="button"
             className="text-sm font-bold text-white bg-red-500 p-2 rounded-lg ml-8 hover:text-red-700"
             onClick={() => removePet(index)}
           >
             Remove Pet
           </button>
           </div>
         </div>
     </div>
     
   </div>
   
    ))}
    
    <button
      type="button"
      className="text-sm text-white bg-green-700 p-2 rounded-lg"
      onClick={addPet}
    >
      Add Another Pet
    </button>
  </>
)}

          <div className="form-footer flex justify-between mt-6">
            <button
              type="button"
              className={`flex-1 focus:outline-none border border-gray-300 py-2 px-4 rounded-lg shadow-sm text-center text-gray-800 bg-white hover:bg-gray-100 text-lg ${
                currentStep === 1 ? 'hidden' : 'inline'
              }`}
              onClick={handlePrev}
            >
              Previous
            </button>
            <button
              type="button"
              className={`flex-1 border ml-8 border-transparent focus:outline-none p-3 rounded-lg text-center text-white bg-orange-600 hover:bg-orange-700 text-lg`}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : currentStep === 2 ? 'Submit' : 'Next'}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default StepWiseRegistrationForm;
