
import React from 'react'

const Button3b = ({ type, bgColor, children }) => {
  return (
    <button type={type} className="group-btn3b relative inline-flex justify-center items-center px-7 py-3.5 w-full rounded shadow-lg outline-none text-lg text-black font-medium overflow-hidden transition-all duration-100 ease-in transform hover:scale-110 hover:bg-transparent hover:shadow-none active:top-0.5 focus:outline-none">
      {children}
      {/* button::after */}
      <span className={`-z-1 absolute top-0 left-0 w-full h-full shadow-inset ${bgColor} transition-all duration-200 ease-in transform group-hover:scale-150 group-btn3b-hover:rotate-180`} aria-hidden="true"/>
    </button>
  )
}

export default Button3b
