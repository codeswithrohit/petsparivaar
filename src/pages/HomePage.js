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
  const [numberOfPets, setNumberOfPets] = useState(1);
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
  console.log(selectedDates)

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
   
    {
      id: 1,
      imageUrl: "slider1.png",
      link: "/",
      linkName: "Link 1",
    },
    {
      id: 2,
      imageUrl: "slider2.png",
      link: "/",
      linkName: "Link 2",
    },
    
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === imageList.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change the interval as needed

    return () => clearInterval(intervalId);
  }, [currentImageIndex]);

  const handlePetSelection = (pet) => {
    setSelectedPet(pet);
  };
  const handleTabSelection = (tab) => {
    setSelectedTab(tab);
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
    router.push(`/petdetail?petType=${selectedPet}&serviceOption=${selectedTab}&Date=${formattedDates}&dogSize=${selectedSize}&numberOfPets=${numberOfPets}&location=${Location}&nearestLocation=${nearestLocation}`);
  };
  
  
  
  
  

  if (!isLoaded) {
    return (
      <div className='flex min-h-screen justify-center item-center'>
        <Spinner />
      </div>
    );
  }

  return (
    <div className='mb-12' >
      <div class="">
      <section  className="bg-cover bg-center  flex justify-center items-center">
  <div  className=" px-0">
    {/* Left Column - Image Slider */}
    <Link href={imageList[currentImageIndex].link} >
      <div className="lg:pr-1 px-4  ">
        <img src={imageList[currentImageIndex].imageUrl} className="h-full w-full object-cover rounded-xl" alt={`Slider Image ${currentImageIndex + 1}`} />
      </div>
    </Link>
    <div className="flex justify-center -mt-8 lg:-mt-12">
      {imageList.map((_, index) => (
        <div
          key={index}
          className={`w-2 h-2 lg:w-4 lg:h-4 mx-1 rounded-full cursor-pointer ${index === currentImageIndex ? 'bg-red-600' : 'bg-gray-300'}`}
          onClick={() => handleDotClick(index)}
        />
      ))}
    </div>
  </div>
</section>

<div className="mx-auto grid max-w-screen-lg px-6 mt-12">
<div className="">
            <p className="font-serif text-xl font-bold text-blue-900">Select a pet</p>
            <div className="mt-4 grid max-w-3xl gap-x-4 gap-y-3 sm:grid-cols-2 md:grid-cols-3">
              <div className="relative">
                <input className="peer hidden" id="radio_dog" type="radio" name="pet" checked={selectedPet === 'Dog'} onChange={() => handlePetSelection('Dog')} />
                <span className="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white peer-checked:border-emerald-400"></span>
                <label className="flex h-full cursor-pointer flex-col rounded-lg p-4 shadow-lg shadow-slate-100 peer-checked:bg-emerald-600 peer-checked:text-white" htmlFor="radio_dog">
                  <span className="mt-2 font-medium">Dog</span>
                </label>
              </div>
              <div className="relative">
                <input className="peer hidden" id="radio_cat" type="radio" name="pet" checked={selectedPet === 'Cat'} onChange={() => handlePetSelection('Cat')} />
                <span className="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white peer-checked:border-emerald-400"></span>
                <label className="flex h-full cursor-pointer flex-col rounded-lg p-4 shadow-lg shadow-slate-100 peer-checked:bg-emerald-600 peer-checked:text-white" htmlFor="radio_cat">
                  <span className="mt-2 font-medium">Cat</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-8 grid max-w-3xl gap-x-4 gap-y-3 sm:grid-cols-3">
            <div className="relative">
              <input className="peer hidden" id="boarding_radio" type="radio" name="service" checked={selectedTab === 'Boarding'} onChange={() => handleTabSelection('Boarding')} />
              <span className="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white peer-checked:border-emerald-400"></span>
              <label className="flex h-full cursor-pointer flex-col rounded-lg p-4 shadow-lg shadow-slate-100 peer-checked:bg-emerald-600 peer-checked:text-white" htmlFor="boarding_radio">
                <span className="mt-2 font-medium">{selectedPet === 'Dog' ? 'Dog Boarding' : 'Cat Boarding'}</span>
              </label>
            </div>
            <div className="relative">
              <input className="peer hidden" id="sitting_radio" type="radio" name="service" checked={selectedTab === 'Sitting'} onChange={() => handleTabSelection('Sitting')} />
              <span className="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white peer-checked:border-emerald-400"></span>
              <label className="flex h-full cursor-pointer flex-col rounded-lg p-4 shadow-lg shadow-slate-100 peer-checked:bg-emerald-600 peer-checked:text-white" htmlFor="sitting_radio">
                <span className="mt-2 font-medium">{selectedPet === 'Dog' ? 'Dog Sitting' : 'Cat Sitting'}</span>
              </label>
            </div>
            <div className="relative">
              <input className="peer hidden" id="care_radio" type="radio" name="service" checked={selectedTab === 'Care'} onChange={() => handleTabSelection('Care')} />
              <span className="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white peer-checked:border-emerald-400"></span>
              <label className="flex h-full cursor-pointer flex-col rounded-lg p-4 shadow-lg shadow-slate-100 peer-checked:bg-emerald-600 peer-checked:text-white" htmlFor="care_radio">
                <span className="mt-2 font-medium">{selectedPet === 'Dog' ? 'Dog Care' : 'Day Care'}</span>
              </label>
            </div>
          </div>


    <div class="">
      <p class="mt-8 font-serif text-xl font-bold text-blue-900">Select a date</p>
      <div class="relative mt-4 w-56">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg aria-hidden="true" class="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>
        </div>
        <RangePicker
                      defaultValue={[dayjs(), dayjs()]}
                      format="YYYY-MM-DD"
                      onChange={(dates) => handleDateChange(dates)}
                      placeholder={['Select start date', 'Select end date']}
                      disabledDate={disabledDate} 
                    />
      </div>
    </div>

  

    <div class="">
      <p class="mt-8 font-serif text-xl font-bold text-blue-900">Select Size</p>
      <div class="mt-4 grid grid-cols-4 gap-2 lg:max-w-xl">
        <button onClick={() => handleSizeSelection('Small')} className={`rounded-lg ${selectedSize === 'Small' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-900'} px-4 py-2 font-medium active:scale-95`}>Small 0-7 Kg</button>
        <button onClick={() => handleSizeSelection('Medium')} className={`rounded-lg ${selectedSize === 'Medium' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-900'} px-4 py-2 font-medium active:scale-95`}>Medium 8-18 Kg</button>
        <button onClick={() => handleSizeSelection('Large')} className={`rounded-lg ${selectedSize === 'Large' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-900'} px-4 py-2 font-medium active:scale-95`}>Large 19-45 kg</button>
        <button onClick={() => handleSizeSelection('Giant')} className={`rounded-lg ${selectedSize === 'Giant' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-900'} px-4 py-2 font-medium active:scale-95`}>Giant 46+ Kg</button>
      </div>
    </div>
    <div className='flex' >
    <div class="">
      <p class="mt-8 font-serif text-xl font-bold text-blue-900">Select Number of Pets</p>
      <div class="">
        <div className="flex-1">
          <div className="relative flex items-center">
            <select
              value={numberOfPets}
              onChange={(e) => setNumberOfPets(e.target.value)}
              className="px-4 py-2.5 bg-white w-full text-sm border-2 focus:border-[#333] outline-none rounded-lg"
            >
              <option value="" disabled>Select Number of Pets</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="ml-3">
      <p class="mt-8 font-serif text-xl font-bold text-blue-900">Select Location</p>
      <div class="">
      <div className="flex flex-wrap space-x-4">
    <div className="relative flex items-center">
      <div className="flex-1">
    
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
    </div>
  </div>
      </div>
    </div>
    <div class="ml-4">
      <p class="mt-8 font-serif text-xl font-bold text-blue-900">Select Radius</p>
      <div class="">
      <div className="flex flex-wrap space-x-4">
    <div className="relative flex items-center">
    <div className="flex-1">
      <div className="relative flex items-center">
        <select
          value={nearestLocation}
          onChange={handleNearestLocationChange}
          className="px-4 py-2.5 bg-white w-full text-sm border-2 focus:border-[#333] outline-none rounded-lg"
        >
          <option value="" disabled selected>
            Nearest location
          </option>
          <option value="2">Nearest 2 Km</option>
          <option value="4">Nearest 4 Km</option>
          <option value="6">Nearest 6 Km</option>
          <option value="8">Nearest 8 Km</option>
          <option value="10">Nearest 10 Km</option>
        </select>
      </div>
    </div>
    </div>
  </div>
      </div>
    </div>
    </div>
    <button onClick={handleSearch} class="mt-8 w-56 rounded-full border-8 border-emerald-500 bg-emerald-600 px-10 py-4 text-lg font-bold text-white transition hover:translate-y-1">Search Now</button>
  </div>
</div>
<script src="https://unpkg.com/flowbite@1.5.2/dist/datepicker.js"></script>

    </div>
  )
}

export default Test
