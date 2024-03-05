import React from 'react'
import { Link } from 'react-router-dom'

function Navbar(props) {
  return (
    <div className='z-10 fixed w-full p-3 px-4 lg:p-4 text-white flex bg-slate-950 text-sm md:text-base'>
        <div className='px-2 py-1 md:p-2'>
           <Link className='px-2 py-1 md:p-2 hover:font-semibold border-2 border-transparent rounded hover:bg-slate-500' to={'/'}>Home</Link>
           <Link className='px-2 py-1 md:p-2 hover:font-semibold border-2 border-transparent rounded hover:bg-slate-500' to={'/analyzer'}>Analyzer</Link>
           
        </div>
        <div className='ml-auto'>
            <props.GoogleSignOutButton />
        </div>
    </div>
  )
}

export default Navbar