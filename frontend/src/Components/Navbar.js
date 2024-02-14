import React from 'react'
import { Link } from 'react-router-dom'

function Navbar(props) {
  return (
    <div className='z-1 fixed w-full p-4 text-white flex'>
        <div className='p-2'>
           <Link className='px-2'> Home </Link>
           <Link className='px-2'> Dashboard </Link>
        </div>
        <div className='ml-auto'>
            <props.GoogleSignOutButton/>
        </div>
    </div>
  )
}

export default Navbar