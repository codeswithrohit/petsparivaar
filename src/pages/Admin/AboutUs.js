import React, { useState, useEffect } from 'react';
import { firebase } from '../../Firebase/config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'tailwindcss/tailwind.css'; // Ensure Tailwind CSS is imported
import AdminNavbar from "../../components/AdminNav";

const AboutUS = () => {
  const [aboutText, setAboutText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aboutData, setAboutData] = useState('');
  const [isEditing, setIsEditing] = useState(false);
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

  const handleEdit = () => {
    setAboutText(aboutData);
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await firebase.firestore().collection('about').doc('aboutUs').set({
        text: aboutText
      });
      setIsSubmitting(false);
      setAboutData(aboutText);
      setIsEditing(false);
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-white'>
      <AdminNavbar />
      <div className="lg:ml-64 container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">About Us</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : isEditing ? (
          <form id="about-form" onSubmit={handleSubmit} className="mt-4">
            <textarea
              className="w-full p-2 border rounded mb-2"
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              placeholder="Enter About Us text"
              required
            />
            <button 
              type="submit" 
              className={`bg-green-500 text-white px-4 py-2 rounded ${isSubmitting ? 'bg-opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
            <button 
              type="button" 
              className="bg-gray-500 text-white px-4 py-2 rounded ml-2 hover:bg-gray-600"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <p className="mb-4 whitespace-pre-line">{aboutData}</p>
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" 
              onClick={handleEdit}
            >
              Edit
            </button>
          </>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default AboutUS;
