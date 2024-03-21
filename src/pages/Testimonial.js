import React from "react";
function Testimonial() {
  return (
    <div>
     <section className="bg-white dark:bg-gray-900">
    <div className="relative flex">
        <div className="min-h-screen lg:w-1/3"></div>
        <div className="hidden w-3/4 min-h-screen bg-gray-100 dark:bg-gray-800 lg:block"></div>

        <div
            className="container flex flex-col justify-center w-full min-h-screen px-6 py-10 mx-auto lg:absolute lg:inset-x-0">
            <h1 className="text-2xl font-semibold text-gray-800 capitalize lg:text-3xl dark:text-white">
                What our <span className="text-orange-500">customers</span> <br/> are saying
            </h1>

            <div className="mt-10 lg:mt-20 lg:flex lg:items-center">
                <img className="object-cover object-center w-full lg:w-[32rem] rounded-lg h-96" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80" alt=""/>

                <div className="mt-8 lg:px-10 lg:mt-0">
                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-white lg:w-72">
                        Help us improve our productivity
                    </h1>

                    <p className="max-w-lg mt-6 text-gray-500 dark:text-gray-400">
                        “ Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempore quibusdam ducimus libero ad
                        tempora doloribus expedita laborum saepe voluptas perferendis delectus assumenda rerum, culpa
                        aperiam dolorum, obcaecati corrupti aspernatur a. ”
                    </p>

                    <h3 className="mt-6 text-lg font-medium text-orange-500">Ronik Ederson</h3>
                    <p className="text-gray-600 dark:text-gray-300">Marketing Manager at Stech</p>
                </div>
            </div>

          
        </div>
    </div>
</section>
    </div>
  );
}

export default Testimonial;
