/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, Galleryef, useRef } from "react";
import { firebase } from "../../Firebase/config";
import { useRouter } from "next/router";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminNavbar from "../../components/AdminNav";

const HomeCarousel = () => {
  const router = useRouter(); // Access the router

 

  const [gallery, setGallery] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [formData, setFormData] = useState({
    title: "",
    frontImage: "",
  });

  const [showAllInputFormats, setShowAllInputFormats] = useState(false);
  const handleShowAllInputFormats = () => {
    setShowAllInputFormats(true);
  };

  const handleCloseAllInputFormats = () => {
    setShowAllInputFormats(false);
  };
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChanges = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (name === "frontImage") {
      setFormData({ ...formData, [name]: files[0] });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const db = firebase.firestore();
      const storage = firebase.storage();

      let frontImageUrl = "";
      if (formData.frontImage) {
        const frontImageFile = formData.frontImage;
        const storageRef = storage.ref();
        const frontImageRef = storageRef.child(frontImageFile.name);
        await frontImageRef.put(frontImageFile);
        frontImageUrl = await frontImageRef.getDownloadURL();
      }

      // Get the current date
      const currentDate = new Date().toISOString(); // Get the current date in ISO format

      // Include the current date in the data to upload
      const dataToUpload = {
        ...formData,
        frontImage: frontImageUrl,
        date: currentDate,
      };

      await db.collection("HomeCarousel").add(dataToUpload);
      toast.success("Data uploaded successfully!");
      router.reload();
    } catch (error) {
      console.error("Error uploading data: ", error);
      toast.error("Error uploading data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // New state to manage pop-up visibility and selected Gallery's data
  const [showPopup, setShowPopup] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [editedGallery, setEditedGallery] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(() => {
      const db = firebase.firestore();
      const GallerysRef = db.collection("HomeCarousel");

      GallerysRef.get()
        .then((querySnapshot) => {
          const gallery = [];
          querySnapshot.forEach((doc) => {
            gallery.push({ ...doc.data(), id: doc.id });
          });

          setGallery(gallery);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error getting documents: ", error);
          setIsLoading(false);
        });
    });

    return () => unsubscribe();
  }, [router]);

  // Function to handle showing E details
  const handleEditDetails = (Gallery) => {
    setSelectedGallery(Gallery);
    setEditedGallery({ ...Gallery });
    setShowPopup(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedGallery((prevGallery) => ({
      ...prevGallery,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editedGallery) {
        const db = firebase.firestore();
        const GalleryRef = db.collection("HomeCarousel").doc(editedGallery.id);
        await GalleryRef.update({
          title: editedGallery.title,
        });
        setShowPopup(false);
        setEditedGallery(null);
        toast.success("Changes saved successfully!");
        router.reload();
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("An error occurred while saving changes.", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
      });
    }
  };

  // Function to handle closing the pop-up
  const handleClosePopup = () => {
    setSelectedGallery(null);
    setShowPopup(false);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = gallery.slice(startIndex, endIndex);

  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(gallery.length / itemsPerPage);

  const handleDelete = async (id) => {
    try {
      const db = firebase.firestore();
      await db.collection("HomeCarousel").doc(id).delete();
      const updatedData = gallery.filter((item) => item.id !== id);
      setGallery(updatedData);
      toast.success("Deletion successful!");
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast.error("Deletion failed. Please try again.", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };


  const handleDeleteImage = async () => {
    try {
      const storage = firebase.storage();
      const imageRef = storage.refFromURL(editedGallery.frontImage);
      await imageRef.delete();
      setEditedGallery({ ...editedGallery, frontImage: "" });
      toast.success("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image: ", error);
      toast.error("Error deleting image. Please try again.");
    }
  };

  const handleReplaceImage = async (e) => {
    const { files } = e.target;
    if (files.length === 0) return;

    const storage = firebase.storage();
    const storageRef = storage.ref();
    const frontImageFile = files[0];
    const frontImageRef = storageRef.child(frontImageFile.name);

    try {
      await frontImageRef.put(frontImageFile);
      const frontImageUrl = await frontImageRef.getDownloadURL();
      setEditedGallery({ ...editedGallery, frontImage: frontImageUrl });
      toast.success("New image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading new image: ", error);
      toast.error("Error uploading new image. Please try again.");
    }
  };

  return (
    <div className="m-auto min-h-screen bg-white dark:bg-gray-900">
      <AdminNavbar />
      <section className="bg-white lg:ml-64  dark:bg-gray-900">
        <div className="container px-6 py-10 mx-auto">
          {showAllInputFormats ? (
            <div>
              <form
                onSubmit={handleFormSubmit}
                className="max-w-2xl mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
              >
               

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <input
                      type="text"
                      name="title"
                      placeholder="Enter link"
                      onChange={handleInputChanges}
                      required
                      className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div>
                    <input
                      type="file"
                      name="frontImage"
                      onChange={handleFileChange}
                      required
                      accept="image/*" // Limit file selection to images
                      className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                </div>

                {/* Add similar grid layouts for the remaining input fields */}
                {/* ... */}
                <div className="flex items-center justify-center mt-4">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                  <button
                  onClick={handleCloseAllInputFormats}
                  className="bg-red-500 hover:bg-red-700 text-white ml-2 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Close Form
                </button>
                </div>
              </form>
            </div>
          ) : (
            // Display the add PG Detail button when isEditing is false and showAllInputFormats is false
            <div className="flex justify-end items-end">
  <button onClick={handleShowAllInputFormats} className="w-64 p-2 bg-blue-500 text-white rounded-md">
    Add Data
  </button>
</div>
          )}

          <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 xl:grid-cols-3">
            {isLoading ? (
              <h1>Loading</h1>
            ) : (
              gallery.map((Gallery, idx) => (
                <div
                  key={idx}
                  className="max-w-sm rounded overflow-hidden shadow-lg m-4"
                >
                  <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">{Gallery.title}</div>
                    
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={() => handleDelete(Gallery.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md text-xs focus:outline-none"
                      >
                        Delete
                      </button>
                      {/* You can add an edit functionality or link to an edit page */}
                      {/* <Link href={`/edit/${Gallery.id}`}> */}
                      {/*   <a className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs focus:outline-none">Edit</a> */}
                      {/* </Link> */}
                      <button
                        onClick={() => handleEditDetails(Gallery)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs focus:outline-none"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              {/* Back Button */}
              <button
                onClick={() => handlePaginationClick(currentPage - 1)}
                className={`px-4 py-2 text-sm text-white font-medium bg-red-300 rounded-md ${
                  currentPage === 1 ? "bg-red-400 cursor-not-allowed" : ""
                }`}
                disabled={currentPage === 1}
              >
                <FiChevronLeft className="inline-block mr-1" /> Previous
              </button>

              {/* Page Buttons */}
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePaginationClick(index + 1)}
                  className={`px-4 py-2 text-sm text-white font-medium bg-red-300 rounded-md ${
                    currentPage === index + 1 ? "bg-red-400" : ""
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => handlePaginationClick(currentPage + 1)}
                className={`px-4 py-2 text-sm text-white font-medium bg-red-300 rounded-md ${
                  currentPage === totalPages
                    ? "bg-red-400 cursor-not-allowed"
                    : ""
                }`}
                disabled={currentPage === totalPages}
              >
                Next <FiChevronRight className="inline-block ml-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Render pop-up if showPopup is true */}
      {showPopup && selectedGallery && (
        <div className="fixed lg:ml-64  overflow-y-auto inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg mt-80">
          {editedGallery.frontImage && (
              <div>
                <img
                  className="w-32 h-32 object-cover mb-4"
                  src={editedGallery.frontImage}
                  alt={editedGallery.productname}
                />
                <button
                  onClick={handleDeleteImage}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-300 rounded-md mr-2"
                >
                  Delete Image
                </button>
              </div>
            )}

            {/* Input to upload a new image */}
            <div>
              <label className="block text-sm font-medium text-black">
                Upload New Image
              </label>
              <input
                type="file"
                onChange={handleReplaceImage}
                className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-black"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={editedGallery.title}
                    onChange={(e) =>
                      setEditedGallery({ ...editedGallery, title: e.target.value })
                    }
                    className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                {/* Add more fields here for editing */}
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-red-300 rounded-md mr-2"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-400 rounded-md"
                  onClick={handleClosePopup}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default HomeCarousel;
