/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from 'react'
import {useRouter} from 'next/router'
import Head from 'next/head'
import Order from '../../models/Order'
import mongoose from 'mongoose'
import { PaperClipIcon } from '@heroicons/react/20/solid'
const MyOrder = ({order}) => {
  const products = order.products;
  const petDetails = order.petDetails;
  const router = useRouter()
  useEffect(()=>{
    if(router.query.cleaCart == 1){
      clearCart()
    }
  })

  return (
    <div className='min-h-screen'>
       <Head>
        <title>order</title>
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" />
        <link rel="icon" href="/icon.png" />
      </Head>
      <section class="flex lg:ml-64  items-center  bg-gray-100  font-poppins dark:bg-gray-800 ">
<div class="justify-center flex-1 max-w-6xl px-4 py-4 mx-auto bg-white border rounded-md dark:border-gray-900 dark:bg-gray-900 md:py-10 md:px-10">
<div>
<h1 class="px-4 mb-8 text-2xl font-semibold tracking-wide text-gray-700 dark:text-gray-300 ">
Thank you. Your order no. #{order.orderId} has been received. </h1>
<div class="flex border-b border-gray-200 dark:border-gray-700  items-stretch justify-start w-full h-full px-4 mb-8 md:flex-row xl:flex-col md:space-x-6 lg:space-x-8 xl:space-x-0">
<div class="flex items-start justify-start flex-shrink-0">
<div class="flex items-center justify-center w-full pb-6 space-x-4 md:justify-start">
{/* <img src="https://i.postimg.cc/RhQYkKYk/pexels-italo-melo-2379005.jpg" class="object-cover w-16 h-16 rounded-md" alt="avatar"/> */}
<div class="flex flex-col items-start justify-start space-y-2">
<p class="text-lg font-semibold leading-4 text-left text-gray-800 dark:text-gray-400">
{order.name}</p>
{/* <p class="text-sm leading-4 text-gray-600 dark:text-gray-400">16 Previous Orders</p> */}
<p class="text-sm leading-4 cursor-pointer dark:text-gray-400">{order.email}</p>
<p class="text-sm leading-4 cursor-pointer dark:text-gray-400">{order.phonenumber}</p>

</div>
</div>
</div>
</div>





<h1 class="px-4 mb-8 text-md font-semibold tracking-wide text-gray-700 dark:text-gray-300 ">
Pet Keeper Information </h1>
{Object.keys(products).map((key) => (
  <div key={key} class="flex flex-wrap items-center pb-4 mb-10 border-b border-gray-200 dark:border-gray-700">
  <div class="w-full px-4 mb-4 md:w-1/4">
  <p class="mb-2 text-sm leading-5 text-gray-600 dark:text-gray-400 ">
  Name: </p>
  <p class="text-base font-semibold leading-4 text-gray-800 dark:text-gray-400">
  {products[key].name}</p>
  </div>
  <div class="w-full px-4 mb-4 md:w-1/4">
  <p class="mb-2 text-sm leading-5 text-gray-600 dark:text-gray-400 ">
  Pet Type: </p>
  <p class="text-base font-semibold leading-4 text-gray-800 dark:text-gray-400">
  {products[key].type}
  </p>
  </div>
  <div class="w-full px-4 mb-4 md:w-1/4">
  <p class="mb-2 text-sm font-medium leading-5 text-gray-800 dark:text-gray-400 ">
  Pet Service: </p>
  <p class="text-base font-semibold leading-4 text-teal-600 dark:text-gray-400">
  {products[key].service}</p>
  </div>
  <div class="w-full px-4 mb-4 md:w-1/4">
  <p class="mb-2 text-sm leading-5 text-gray-600 dark:text-gray-400 ">
   location: </p>
  <p class="text-base font-semibold leading-4 text-gray-800 dark:text-gray-400 ">
  {products[key].location}
   </p>
  </div>
  
  </div>
))}
<h1 class="px-4 mb-8 text-md font-semibold tracking-wide text-gray-700 dark:text-gray-300 ">
Your Pet Information </h1>

<div class="flex flex-wrap items-center pb-4 mb-10 border-b border-gray-200 dark:border-gray-700">
  <div class="w-full px-4 mb-4 md:w-1/4">
    <p class="mb-2 text-sm leading-5 text-gray-600 dark:text-gray-400 ">
      Name:
    </p>
    <p class="text-base font-semibold leading-4 text-gray-800 dark:text-gray-400">
      {petDetails.petName}
    </p>
  </div>
  <div class="w-full px-4 mb-4 md:w-1/4">
    <p class="mb-2 text-sm leading-5 text-gray-600 dark:text-gray-400 ">
      Pet Age:
    </p>
    <p class="text-base font-semibold leading-4 text-gray-800 dark:text-gray-400">
      {petDetails.petAge}
    </p>
  </div>
  <div class="w-full px-4 mb-4 md:w-1/4">
    <p class="mb-2 text-sm font-medium leading-5 text-gray-800 dark:text-gray-400 ">
      Pet Medical History:
    </p>
    <p class="text-base font-semibold leading-4 text-teal-600 dark:text-gray-400">
      {petDetails.medicalHistory}
    </p>
  </div>
  <div class="w-full px-4 mb-4 md:w-1/4">
    <p class="mb-2 text-sm leading-5 text-gray-600 dark:text-gray-400 ">
      Vaccinated:
    </p>
    <p class="text-base font-semibold leading-4 text-gray-800 dark:text-gray-400 ">
      {petDetails.vaccinated ? 'Yes' : 'No'}
    </p>
  </div>
</div>





<div class="px-4 mb-10">
<div class="flex flex-col items-stretch justify-center w-full space-y-4 md:flex-row md:space-y-0 md:space-x-8">
<div class="flex flex-col w-full space-y-6 ">
<h2 class="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-400">Payment details</h2>
<div class="flex flex-col items-center justify-center w-full pb-4 space-y-4 border-b border-gray-200 dark:border-gray-700">
<div class="flex justify-between w-full">
<p class="text-base leading-4 text-gray-800 dark:text-gray-400">Subtotal</p>
<p class="text-base leading-4 text-gray-600 dark:text-gray-400">Rs.{order.amount}</p>
</div>
{/* <div class="flex items-center justify-between w-full">
<p class="text-base leading-4 text-gray-800 dark:text-gray-400">Discount
</p>
<p class="text-base leading-4 text-gray-600 dark:text-gray-400">0%</p>
</div>
<div class="flex items-center justify-between w-full">
<p class="text-base leading-4 text-gray-800 dark:text-gray-400">Shipping</p>
<p class="text-base leading-4 text-gray-600 dark:text-gray-400">Rs.0</p>
</div> */}
</div>
<div class="flex items-center justify-between w-full">
<p class="text-base font-semibold leading-4 text-gray-800 dark:text-gray-400">Total</p>
<p class="text-base font-semibold leading-4 text-gray-600 dark:text-gray-400">Rs.{order.amount}</p>
</div>
</div>

</div>
</div>
<div class="flex flex-wrap items-center justify-start gap-4 px-4 mt-6 ">
{/* <button class="w-full px-4 py-2 text-teal-500 border border-teal-500 rounded-md md:w-auto hover:text-gray-100 hover:bg-teal-600 dark:border-gray-700 dark:hover:bg-gray-700 dark:text-gray-300">
Go back shopping
</button> */}
{/* <button class="w-full px-4 py-2 bg-teal-500 rounded-md text-gray-50 md:w-auto dark:text-gray-300 hover:bg-teal-600 dark:hover:bg-gray-700 dark:bg-gray-800">
View career details
</button> */}
</div>
</div>
</div>
</section>
    </div>
  )
}
export async function getServerSideProps(context) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI)
  }

  let order = await Order.findById(context.query.id)



  return {
    props: { order: JSON.parse(JSON.stringify(order)),  }, // will be passed to the page component as props
  }
}
export default MyOrder