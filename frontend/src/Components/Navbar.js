import React from 'react'
import { Link } from 'react-router-dom'

function Navbar(props) {
  return (
    <div className='z-1 fixed w-full p-4 text-white flex bg-slate-950'>
        <div className='p-2'>
           <Link className='px-2' to={'/'}> Home </Link>
           <Link className='px-2' to={'/analyzer'}> Analyzer </Link>
        </div>
        <div className='ml-auto'>
            <props.GoogleSignOutButton/>
        </div>
    </div>
  )
}

export default Navbar