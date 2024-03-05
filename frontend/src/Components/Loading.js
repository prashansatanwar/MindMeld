import React from 'react'

function Loading() {
  return (
    <>
        <div className="w-14 h-14 md:w-20 md:h-20 rounded-full absolute border-4 border-solid border-gray-500"></div>
        <div className="w-14 h-14 md:w-20 md:h-20  rounded-full animate-spin absolute border-4 border-solid border-white border-t-transparent shadow-md"></div>
    </>
  )
}

export default Loading