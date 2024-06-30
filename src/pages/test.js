import React, { useState, useRef, useEffect } from 'react';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
import Link from 'next/link';
import { DatePicker } from "antd";
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Spinner from '../components/Spinner';
import { useRouter } from 'next/router';

dayjs.extend(customParseFormat);
const placesLibrary = ['places'];
const { RangePicker } = DatePicker;

const Test = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedPet, setSelectedPet] = useState('Dog');
  const [selectedTab, setSelectedTab] = useState('Boarding');
  const [selectedDates, setSelectedDates] = useState({});
  const [nearestLocation, setNearestLocation] = useState('');
  const [Location, setLocation] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  const handleDateChange = (dates, itemId) => {
    if (dates && dates.length === 2) {
      setSelectedDates((prevDates) => ({
        ...prevDates,
        start: dates[0].format('YYYY-MM-DD'),
        end: dates[1].format('YYYY-MM-DD'),
      }));
    }
  };
  console.log(selectedDates);

  useEffect(() => {
    const today = dayjs().format('YYYY-MM-DD'); // Get today's date in the format YYYY-MM-DD
    const dateInputs = document.querySelectorAll('.ant-picker-input input');

    dateInputs.forEach((input) => {
      input.setAttribute('min', today);
    });
  }, []);

  const disabledDate = (current) => {
    // Disable dates before today
    return current && current < dayjs().startOf('day');
  };

  const imageList = [
    { id: 1, imageUrl: "s1.png", link: "/", linkName: "Link 1" },
    { id: 2, imageUrl: "s2.png", link: "/", linkName: "Link 2" },
    { id: 3, imageUrl: "s3.png", link: "/", linkName: "Link 2" },
    { id: 4, imageUrl: "s4.png", link: "/", linkName: "Link 2" },
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === imageList.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change the interval as needed

    return () => clearInterval(intervalId);
  }, [currentImageIndex]);

  const handlePetSelection = (event) => {
    setSelectedPet(event.target.value);
  };

  const handleTabSelection = (event) => {
    setSelectedTab(event.target.value);
  };

  const handleSizeSelection = (size) => {
    setSelectedSize(size);
  };

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

  const handleNearestLocationChange = (e) => {
    setNearestLocation(e.target.value);
  };

  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();

    const formattedDates = `${selectedDates.start},${selectedDates.end}`;
    router.push(`/petdetail?petType=${selectedPet}&serviceOption=${selectedTab}&Date=${formattedDates}&dogSize=${selectedSize}&location=${Location}&nearestLocation=${nearestLocation}`);
  };

  if (!isLoaded) {
    return (
      <div className='flex min-h-screen justify-center item-center'>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <div className="bg-white dark:bg-slate-800 justify-center items-center rounded-md shadow-md p-5 lg:p-10 w-full lg:w-[100%] flex flex-col lg:flex-row lg:items-center space-y-5 lg:space-y-0 lg:space-x-5">
        <div className="w-full lg:flex-1">
          <label htmlFor="select-input-1" className="block text-sm text-gray-500 dark:text-slate-200 mb-1">Select Pet</label>
          <select
            id="select-input-1"
            className="focus:outline-none w-full text-sm p-2 dark:bg-slate-800 dark:text-slate-400 border border-gray-300 rounded-md"
            value={selectedPet}
            onChange={handlePetSelection}
          >
            <option value="" className="text-sm">Select a pet</option>
            <option value="Dog" className="text-sm">Dog</option>
            <option value="Cat" className="text-sm">Cat</option>
          </select>
        </div>
        <div className="w-full lg:flex-1 mt-8">
          <label htmlFor="service-select" className="block text-sm text-gray-500 dark:text-slate-200 mb-1">Select Service</label>
          <select
            id="service-select"
            className="focus:outline-none w-full text-sm p-2 dark:bg-slate-800 dark:text-slate-400 border border-gray-300 rounded-md"
            value={selectedTab}
            onChange={handleTabSelection}
          >
            <option value="" className="text-sm">Select a service</option>
            <option value="Boarding" className="text-sm">{selectedPet === 'Dog' ? 'Dog Boarding' : 'Cat Boarding'}</option>
            <option value="Sitting" className="text-sm">{selectedPet === 'Dog' ? 'Dog Sitting' : 'Cat Sitting'}</option>
            <option value="Care" className="text-sm">{selectedPet === 'Dog' ? 'Dog Care' : 'Day Care'}</option>
          </select>
        </div>
        <div className="w-full lg:flex-1">
          <label htmlFor="input-date-1" className="block text-sm text-gray-500 dark:text-slate-200 mb-1">Select Date</label>
          <RangePicker
            defaultValue={[dayjs(), dayjs()]}
            format="YYYY-MM-DD"
            onChange={(dates) => handleDateChange(dates)}
            placeholder={['Select start date', 'Select end date']}
            disabledDate={disabledDate}
          />
        </div>
        <div className="w-full lg:flex-1">
          <label htmlFor="input-date-5" className="block text-sm text-gray-500 dark:text-slate-200 mb-1">Location</label>
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <input
              type="text"
              value={Location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Search Location"
              className="px-4 py-2.5 bg-white w-full text-sm border-2 focus:border-[#333] outline-none rounded-lg"
            />
          </Autocomplete>
        </div>
        <div className="w-full lg:flex-1">
          <label htmlFor="input-date-5" className="block text-sm text-gray-500 dark:text-slate-200 mb-1">Nearest location</label>
          <select
            value={nearestLocation}
            onChange={handleNearestLocationChange}
            className="px-4 py-2.5 bg-white w-full text-sm border-2 focus:border-[#333] outline-none rounded-lg"
          >
            <option value="" disabled>Nearest location</option>
            <option value="2">Nearest 2 Km</option>
            <option value="4">Nearest 4 Km</option>
            <option value="6">Nearest 6 Km</option>
            <option value="8">Nearest 8 Km</option>
            <option value="10">Nearest 10 Km</option>
          </select>
        </div>
        <div className="w-full lg:w-auto lg:flex-shrink-0">
          <button onClick={handleSearch} className="text-white mt-4 bg-yellow-500 rounded-full px-5 py-2 w-full lg:w-auto lg:h-10 hover:bg-yellow-600 focus:outline-none">Search</button>
        </div>
      </div>
    </div>
  );
};

export default Test;
