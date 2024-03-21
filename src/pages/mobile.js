import React, { useState } from 'react';
import { firebase } from '../Firebase/config';
import "firebase/compat/auth";

const PhoneAuth = () => {
    const [currentSteps, setCurrentSteps] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState(null); // Initialize as null
  const [isVerified, setIsVerified] = useState(false); // Initialize as false
  const [verifiedPhoneNumber, setVerifiedPhoneNumber] = useState(''); // To store the verified phone number

  const handleSendCode = () => {
    const recaptchaVerifier = new firebase.auth.RecaptchaVerifier('send-code-button', {
      size: 'invisible',
    });

    firebase.auth().signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
      .then((confirmationResult) => {
        // Save the verification ID
        setVerificationId(confirmationResult.verificationId);
        setCurrentSteps(2);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleVerifyCode = () => {
    const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);

    firebase.auth().signInWithCredential(credential)
      .then((userCredential) => {
        // User signed in successfully
        console.log('Mobile number verified successfully');
        setIsVerified(true); // Set verification status to true
        setVerifiedPhoneNumber(phoneNumber); // Store the verified phone number
        setCurrentSteps(3);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      {isVerified ? (
        <div>
             {currentSteps === 3 && (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Step {currentSteps}: Personal Information</h2>
              <h2>Mobile number verification successfully!</h2>
          <p>Verified Mobile Number: {verifiedPhoneNumber}</p>
            </>
          )}
        
        </div>
      ) : verificationId ? (
        <>
          

          {currentSteps === 2 && (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Step {currentSteps}: OTP Verification</h2>
              <div className="mb-2">
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="button"
                className={`flex-1 border border-transparent focus:outline-none p-3 rounded-lg text-center text-white bg-indigo-600 hover:bg-indigo-700 text-lg`}
                onClick={handleVerifyCode}
              >
                Verify
              </button>
            </>
          )}
        </>
      ) : (
        <>
          
          {currentSteps === 1 && (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Step {currentSteps}: Mobile Number Verification</h2>
              <div className="mb-2">
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Mobile Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="button"
                 id="send-code-button"
                className={`flex-1 border border-transparent focus:outline-none p-3 rounded-lg text-center text-white bg-indigo-600 hover:bg-indigo-700 text-lg`}
                onClick={handleSendCode}
              >
                Verify
              </button>
            </>
          )}

        </>
      )}
    </div>
  );
};

export default PhoneAuth;