import React, { useState, useRef, useEffect } from 'react';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
import { FaDog, FaCat } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const placesLibrary = ['places'];

const Index = () => {
  const backgroundStyle = {
    backgroundImage:
      "url('https://images.pexels.com/photos/3198012/pexels-photo-3198012.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  };

  const [selectedTab, setSelectedTab] = useState('Dog');
  const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
  const [selectedServiceOption, setSelectedServiceOption] = useState(null);
  const [selectedDogSize, setSelectedDogSize] = useState('');
  const [numberOfPets, setNumberOfPets] = useState(1);

  const getCurrentDate = () => {
    const today = new Date();
    return today;
  };

  useEffect(() => {
    const currentDate = getCurrentDate();
    setSelectedDateRange([currentDate]);
  }, []);

  const handleServiceOptionClick = (option) => {
    setSelectedServiceOption(option);
  };

  const [searchResult, setSearchResult] = useState('')

  const autocompleteRef = useRef();

  const { isLoaded } =  useLoadScript({
    googleMapsApiKey: 'AIzaSyB6gEq59Ly20DUl7dEhHW9KgnaZy4HrkqQ',
    libraries: placesLibrary
});

  const onLoad = () => {
     const autocomplete = autocompleteRef.current
  }

  const onPlaceChanged = (place) => {
    setSearchResult(place)
    console.log(searchResult)
  }

  if(!isLoaded) {
    return <div>Loading...</div>
  };

  return (
    <div className="min-h-screen w-full bg-gray-900" style={backgroundStyle}>
      <div className="container mx-auto p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-lg bg-gray-800 bg-opacity-50 p-6 md:p-10 lg:p-46 shadow-lg backdrop-blur-md">
            <div>
              <h2 className="text-lg md:text-xl lg:text-xl text-white">Choose Your Pet</h2>
              <div className="flex justify-center space-x-2 mt-2">
                <button
                  className={`px-4 py-2 text-lg rounded-full focus:outline-none ${
                    selectedTab === 'Dog' ? 'bg-red-300 text-white' : 'bg-gray-300 text-gray-800'
                  }`}
                  onClick={() => setSelectedTab('Dog')}
                >
                  <FaDog className="text-xl inline-block mr-2" /> Dog
                </button>
                <button
                  className={`px-4 py-2 text-lg rounded-full focus:outline-none ${
                    selectedTab === 'Cat' ? 'bg-red-300 text-white' : 'bg-gray-300 text-gray-800'
                  }`}
                  onClick={() => setSelectedTab('Cat')}
                >
                  <FaCat className="text-xl inline-block mr-2" /> Cat
                </button>
              </div>
            </div>

            <div className="mt-2">
              <h2 className="text-lg md:text-xl lg:text-xl text-white">Select Service</h2>
              <div className="flex flex-wrap justify-center space-x-2 mt-2">
                {(selectedTab === 'Dog'
                  ? ['Dog Boarding', 'Dog Walking', 'Day Care', 'Dog Sitting', ]
                  : ['Cat Boarding', 'Cat Sitting', 'Day Care', ]
                ).map((serviceOption) => (
                  <button
                    key={serviceOption}
                    className={`px-4 py-2  text-sm rounded-full focus:outline-none ${
                      selectedServiceOption === serviceOption ? 'bg-red-300 text-white' : 'bg-gray-300 text-gray-800'
                    }`}
                    onClick={() => handleServiceOptionClick(serviceOption)}
                  >
                    {selectedServiceOption === serviceOption ? (
                      <span className="bg-red-300 text-white px-2 rounded-full">{serviceOption}</span>
                    ) : (
                      serviceOption
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h2 className="text-lg md:text-xl lg:text-xl text-white">Select Date Range:</h2>
              <DatePicker
                selected={selectedDateRange[0]}
                startDate={selectedDateRange[0]}
                endDate={selectedDateRange[1]}
                onChange={(dates) => setSelectedDateRange(dates)}
                selectsRange
                startDatePlaceholderText="Start Date"
                endDatePlaceholderText="End Date"
                dateFormat="MM/dd/yyyy"
                className="bg-white border-white rounded-lg p-2 text-black w-full"
              />
            </div>

            {selectedTab === 'Dog' && (
              <div className="mt-6">
                <h2 className="text-lg text-white md:text-xl lg:text-xl">Dog Size</h2>
                <div className="flex justify-center space-x-4 mt-4">
                  {['Small 0-7 Kg', 'Medium 8-18 Kg', 'Large 19-45 Kg', 'Giant 46kg+'].map((sizeOption) => (
                    <button
                      key={sizeOption}
                      className={`px-4 py-2 text-sm rounded-full focus:outline-none ${
                        selectedDogSize === sizeOption ? 'bg-red-300 text-white' : 'bg-gray-300 text-gray-800'
                      }`}
                      onClick={() => setSelectedDogSize(sizeOption)}
                    >
                      {selectedDogSize === sizeOption ? (
                        <span className="bg-red-300 text-white px-2 rounded-full">{sizeOption}</span>
                      ) : (
                        sizeOption
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-2">
              <h2 className="text-lg md:text-xl text-white lg:text-xl">How many pets?</h2>
              <input
                type="range"
                min="1"
                max="3"
                value={numberOfPets}
                onChange={(e) => setNumberOfPets(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xl text-center text-white">{numberOfPets}</div>
            </div>

            <div className="mt-4 flex flex-row">
          <div className="flex flex-col items-start w-1/2">
            <label className="mb-1 text-xl text-white">Location</label>
            <Autocomplete
            onPlaceChanged={(place) => onPlaceChanged(place)}
            onLoad = {onLoad}>

                <input
                type="text"
                placeholder="Search location"
                style={{
                    boxSizing: `border-box`,
                    border: `1px solid transparent`,
                    width: `240px`,
                    height: `32px`,
                    padding: `0 12px`,
                    borderRadius: `3px`,
                    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                    fontSize: `14px`,
                    outline: `none`,
                    textOverflow: `ellipses`,
                }}
                />
            </Autocomplete>
          </div>
          <div className="flex flex-col items-start w-1/2">
            <label className="mb-1 text-xl text-white">Nearest Location</label>
            <div className="relative w-40">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-400 right-2.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <select className="w-full h-10 p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600">
                <option>Within 2km</option>
                <option>2km-4km</option>
                <option>4km-8km</option>
                <option>More Than 8Km</option>
              </select>
            </div>
          </div>
        </div>

            <div className="mt-8 flex justify-center">
              <button
                className="px-6 py-3.5 text-white bg-red-300 rounded-full duration-150 hover:bg-red-500 active:bg-red-300 text-xl"
              >
                Search
              </button>
            </div>
          </div>
          <div className="text-white">
            <h1 className="text-3xl md:text-4xl lg:text-5xl text-red-300">We Care Your Petss</h1>
            <span className="text-gray-300 text-lg mt-2">Find a vetted Pet Sitter to take care of your furry friend</span>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default Index;
