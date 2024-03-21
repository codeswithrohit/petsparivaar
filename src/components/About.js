import React from "react";
import Image from "next/image";

function About() {
  return (
    <div className="flex justify-between min-w-7xl my-24 md:flex-row flex-col gap-y-10">
      <div className="mx-20">
        <Image
          src='About.jpg'
          width={800}
          height={800}
          objectfit="cover"
          className="rounded-2xl shadow-lg"
        />
      </div>
      <div className="md:mr-20 mx-10">
        <h2 className="text-base text-orange-500 font-semibold">About Us</h2>
        <p className="mt-2 mb-5 text-5xl font-bold text-gray-900 sm:text-4xl">
          Lets Know each other More closly
        </p>
        <p className="md:text-base text-sm  text-gray-400">
        PetsParivar introduces Indias exclusive network, dedicated to turning your dream of pet ownership into reality. We are inaugural a unique platform in India  dedicated to uniting pet parents and pet enthusiasts, fostering a community of assistance and encouragement for responsible pet ownership and care. Our objective is to offer solutions for the challenges that arise within our hectic schedules when it comes to caring for pets.
        </p>
       
        
      </div>
    </div>
  );
}

export default About;
