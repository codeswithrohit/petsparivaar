import React from 'react'

const Footer = () => {
  return (
    <div>
      <footer class="bg-gray-900 py-8 font-[sans-serif]">
      <div class="px-12 md:flex md:justify-between md:items-center max-md:text-center">
        <div class="space-y-4">
          <p class="text-gray-200 text-base">Contact Us:</p>
          <p class="text-gray-200 text-base">Phone: 123-456-7890</p>
          <p class="text-gray-200 text-base">Email: info@example.com</p>
        </div>
        <p class='text-gray-200 text-base max-md:mt-4'>Copyright © 2024<a href='/'
        target='_blank' class="hover:underline mx-1">Petsparivaar</a>All Rights Reserved.</p>
      </div>
    </footer>
    </div>
  )
}

export default Footer