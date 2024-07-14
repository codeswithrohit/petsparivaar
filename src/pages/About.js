import React, { useState, useEffect } from "react";
import { firebase } from "../Firebase/config";
import "firebase/firestore";

const About = () => {
  const [aboutData, setAboutData] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doc = await firebase.firestore().collection('about').doc('aboutUs').get();
        if (doc.exists) {
          setAboutData(doc.data().text);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching document: ', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center ">
      {isLoading ? (
        <div className='flex space-x-2 justify-center items-center h-screen'>
          <span className='sr-only'>Loading...</span>
          <div className='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]'></div>
          <div className='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]'></div>
          <div className='h-8 w-8 bg-black rounded-full animate-bounce'></div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-4 w-full ">
          <h1 className="text-4xl font-serif font-extrabold mb-4 text-center text-gray-900">About Us</h1>
          <div className="border-t border-gray-200 pt-4">
            <p className="text-lg font-serif text-gray-700 leading-relaxed whitespace-pre-line">{aboutData}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;
