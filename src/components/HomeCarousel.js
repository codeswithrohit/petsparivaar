/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { firebase } from "../Firebase/config";
import { useRouter } from "next/router";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const HomeCarousel = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
  const [gallery, setGallery] = useState([]);
  const [banner, setBanner] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch gallery data from Firebase
  const fetchGalleryFromFirebase = () => {
    const db = firebase.firestore();
    const GallerysRef = db.collection("HomeCarousel");

    return GallerysRef.onSnapshot(
      (querySnapshot) => {
        const galleryData = [];
        querySnapshot.forEach((doc) => {
          galleryData.push({ ...doc.data(), id: doc.id });
        });

        setGallery(galleryData);
        setIsLoading(false);

        // Store in localStorage
        localStorage.setItem("gallery", JSON.stringify(galleryData));
      },
      (error) => {
        console.error("Error fetching documents: ", error);
        setIsLoading(false);
      }
    );
  };

  const fetchBannerFromFirebase = () => {
    const db = firebase.firestore();
    const BannersRef = db.collection("Banner");

    return BannersRef.onSnapshot(
      (querySnapshot) => {
        const bannerData = [];
        querySnapshot.forEach((doc) => {
          bannerData.push({ ...doc.data(), id: doc.id });
        });

        setBanner(bannerData);
        setIsLoading(false);

        // Store in localStorage
        localStorage.setItem("banner", JSON.stringify(bannerData));
      },
      (error) => {
        console.error("Error fetching documents: ", error);
        setIsLoading(false);
      }
    );
  };

  useEffect(() => {
    // Check localStorage first
    const localGallery = JSON.parse(localStorage.getItem("gallery"));
    if (localGallery && localGallery.length > 0) {
      setGallery(localGallery);
      setIsLoading(false);
    } else {
      setIsLoading(true); // Set loading state before fetching from Firebase
      const unsubscribe = fetchGalleryFromFirebase();
      return () => unsubscribe(); // Clean up Firestore listener
    }
  }, []);

  useEffect(() => {
    // Check localStorage first
    const localBanner = JSON.parse(localStorage.getItem("banner"));
    if (localBanner && localBanner.length > 0) {
      setBanner(localBanner);
      setIsLoading(false);
    } else {
      setIsLoading(true); // Set loading state before fetching from Firebase
      const unsubscribe = fetchBannerFromFirebase();
      return () => unsubscribe(); // Clean up Firestore listener
    }
  }, []);

  useEffect(() => {
    // Always fetch from Firestore to keep data updated
    const unsubscribeFirebase = fetchGalleryFromFirebase();
    return () => unsubscribeFirebase(); // Clean up Firestore listener
  }, []);

  useEffect(() => {
    // Always fetch from Firestore to keep data updated
    const unsubscribeFirebase = fetchBannerFromFirebase();
    return () => unsubscribeFirebase(); // Clean up Firestore listener
  }, []);

  useEffect(() => {
    // Auto-advance carousel
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === gallery.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change the interval as needed

    return () => clearInterval(intervalId); // Clean up interval
  }, [gallery]);

  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handlePrevClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? gallery.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === gallery.length - 1 ? 0 : prevIndex + 1
    );
  };

  // If loading, return a loading indicator
  if (isLoading) {
    return (
      <div className="flex space-x-2 justify-center items-center bg-white h-screen dark:invert">
        <span className="sr-only">Loading...</span>
        <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-8 w-8 bg-black rounded-full animate-bounce"></div>
      </div>
    );
  }

  console.log("Banner", banner);
  console.log("Gallery", gallery);

  return (
    <div className="flex justify-center items-center  relative">
      <div className="flex px-2 md:px-8">
        {/* Left Banner */}
        {/* {banner[0] && (
          <div className="hidden lg:block mr-8">
            <Link href={banner[0].link}>
              <img
                src={banner[0].frontImage}
                className="h-96 w-80 object-contain"
                alt="Left Banner"
              />
            </Link>
          </div>
        )} */}

        {/* Image Slider */}
        <div>
          <div className="">
            {gallery.length > 0 && gallery[currentImageIndex] ? (
              <img
                src={gallery[currentImageIndex].frontImage}
                className="h-full w-full object-cover rounded-xl"
                alt={`Slider Image ${currentImageIndex + 1}`}
              />
            ) : (
              <div className="h-full w-full object-cover rounded-xl bg-gray-200" />
            )}
            <button
              className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg"
              onClick={handlePrevClick}
            >
              <FiChevronLeft size={24} />
            </button>
            <button
              className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg"
              onClick={handleNextClick}
            >
              <FiChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Right Banner */}
        {/* {banner[1] && (
          <div className="hidden lg:block ml-8">
            <Link href={banner[1].link}>
              <img
                src={banner[1].frontImage}
                className="h-96 w-80 object-contain"
                alt="Right Banner"
              />
            </Link>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default HomeCarousel;
