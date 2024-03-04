import React from 'react'

function Loading() {
  return (
    <>
        <div className="w-20 h-20 rounded-full absolute border-4 border-solid border-gray-500"></div>
        <div className="w-20 h-20 rounded-full animate-spin absolute border-4 border-solid border-white border-t-transparent shadow-md"></div>
    </>
  )
}

export default Loading