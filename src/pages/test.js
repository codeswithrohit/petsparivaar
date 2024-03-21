/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from 'react'
import {useRouter} from 'next/router'
import Head from 'next/head'
import Order from '../models/Order'
import mongoose from 'mongoose'
import { PaperClipIcon } from '@heroicons/react/20/solid'
const MyOrder = ({order}) => {
  const products = order.products;
  const router = useRouter()
  useEffect(()=>{
    if(router.query.cleaCart == 1){
      clearCart()
    }
  })
console.log(order)
 
  return (
    <div className='min-h-screen'>
       <Head>
        <title>order</title>
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" />
        <link rel="icon" href="/icon.png" />
      </Head>
      <section class="flex items-center py-24 bg-gray-100 md:py-20 font-poppins dark:bg-gray-800 ">
<div class="justify-center flex-1 max-w-6xl px-4 py-4 mx-auto bg-white border rounded-md dark:border-gray-900 dark:bg-gray-900 md:py-10 md:px-10">
<div>
<h1 class="px-4 mb-8 text-2xl font-semibold tracking-wide text-gray-700 dark:text-gray-300 ">
Thank you. Your order has been received. </h1>
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


<div class="flex flex-wrap items-center pb-4 mb-10 border-b border-gray-200 dark:border-gray-700">
<div class="w-full px-4 mb-4 md:w-1/4">
<p class="mb-2 text-sm leading-5 text-gray-600 dark:text-gray-400 ">
Order Number: </p>
<p class="text-base font-semibold leading-4 text-gray-800 dark:text-gray-400">
#{order.orderId}</p>
</div>
<div class="w-full px-4 mb-4 md:w-1/4">
<p class="mb-2 text-sm leading-5 text-gray-600 dark:text-gray-400 ">
Date: </p>
<p class="text-base font-semibold leading-4 text-gray-800 dark:text-gray-400">
</p>
</div>
<div class="w-full px-4 mb-4 md:w-1/4">
<p class="mb-2 text-sm font-medium leading-5 text-gray-800 dark:text-gray-400 ">
Total: </p>
<p class="text-base font-semibold leading-4 text-teal-600 dark:text-gray-400">
Rs.</p>
</div>
<div class="w-full px-4 mb-4 md:w-1/4">
<p class="mb-2 text-sm leading-5 text-gray-600 dark:text-gray-400 ">
Payment Status: </p>
<p class="text-base font-semibold leading-4 text-gray-800 dark:text-gray-400 ">
 </p>
</div>
{Object.keys(products).map((key)=>{
            return<div key={key} className="flex border-t border-green-400 py-2">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{products[key].name} </h3>
      </div></div>})}
</div>









{/* {orderDetails.cart && Object.keys(orderDetails.cart).length > 0 ? (
            Object.keys(orderDetails.cart).map((key, index) => (
<div key={index}
                class="flex flex-col items-start justify-start w-full mt-4 mb-4 border-b border-gray-200 dark:border-gray-700 md:mt-6 md:flex-row md:items-center md:space-x-6 xl:space-x-8">
                <div class="w-full pb-4 md:pb-6 md:w-40">
                    <img class="hidden w-full h-[150px] object-cover md:block"
                        src={orderDetails.cart[key].frontImage} alt="dress"/>
                    <img class="object-cover w-full  h-[450px] md:hidden"
                        src={orderDetails.cart[key].frontImage}alt="dress"/>
                </div>
                <div class="flex flex-col items-start justify-between w-full pb-6 space-y-2 md:flex-row md:space-y-0">
                    <div class="flex flex-col items-start justify-start w-full space-y-4">
                        <h2 class="text-xl font-semibold leading-6 text-gray-800 dark:text-gray-400 xl:text-2xl">
                        {orderDetails.cart[key].productname}</h2>
                       
                    </div>
                    <div class="flex items-start justify-between w-full space-x-8">
                        <p class="text-base leading-6 dark:text-gray-400 xl:text-lg">{orderDetails.cart[key].price}
                        </p>
                        <p class="text-base leading-6 text-gray-800 dark:text-gray-400 xl:text-lg">qty: {orderDetails.cart[key].qty}</p>
                        <p class="text-base font-semibold leading-6 text-gray-800 dark:text-gray-400 xl:text-lg">
                        {calculateTotalPrice(orderDetails.cart[key].price, orderDetails.cart[key].qty)}</p>
                    </div>
                </div>
            </div>
             ))
             ) : (
               <p>No cart details available.</p>
             )} */}
<div class="px-4 mb-10">
<div class="flex flex-col items-stretch justify-center w-full space-y-4 md:flex-row md:space-y-0 md:space-x-8">
<div class="flex flex-col w-full space-y-6 ">
<h2 class="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-400">Order details</h2>
<div class="flex flex-col items-center justify-center w-full pb-4 space-y-4 border-b border-gray-200 dark:border-gray-700">
<div class="flex justify-between w-full">
<p class="text-base leading-4 text-gray-800 dark:text-gray-400">Subtotal</p>
<p class="text-base leading-4 text-gray-600 dark:text-gray-400">Rs.{order.amount}</p>
</div>
<div class="flex items-center justify-between w-full">
<p class="text-base leading-4 text-gray-800 dark:text-gray-400">Discount
</p>
<p class="text-base leading-4 text-gray-600 dark:text-gray-400">0%</p>
</div>
<div class="flex items-center justify-between w-full">
<p class="text-base leading-4 text-gray-800 dark:text-gray-400">Shipping</p>
<p class="text-base leading-4 text-gray-600 dark:text-gray-400">Rs.0</p>
</div>
</div>
<div class="flex items-center justify-between w-full">
<p class="text-base font-semibold leading-4 text-gray-800 dark:text-gray-400">Total</p>
<p class="text-base font-semibold leading-4 text-gray-600 dark:text-gray-400">Rs.{order.amount}</p>
</div>
</div>
<div class="flex flex-col w-full px-2 space-y-4 md:px-8 ">
<h2 class="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-400">Your Pet Details</h2>
{/* <h2 class="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-400">Order Status - <span className="text-green-600" >{orderDetails.Status}</span></h2> */}
<div class="flex items-start justify-between w-full">
<div class="flex items-center justify-center space-x-2">

<div class="flex flex-col items-center justify-start">
{/* <p class="text-lg font-semibold leading-6 text-gray-800 dark:text-gray-400">
{orderDetails.userAddress}
</p> */}
</div>
</div>

</div>
</div>
</div>
</div>
<div class="flex flex-wrap items-center justify-start gap-4 px-4 mt-6 ">
<button class="w-full px-4 py-2 text-teal-500 border border-teal-500 rounded-md md:w-auto hover:text-gray-100 hover:bg-teal-600 dark:border-gray-700 dark:hover:bg-gray-700 dark:text-gray-300">
Go back shopping
</button>
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