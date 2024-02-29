import React from 'react'
import { Link } from 'react-router-dom'

function Navbar(props) {

  function handleClick() {
    const button_ = document.getElementById('google-logout-button');
    console.log(button_)
    // button_.click();
  }
  return (
    <div className='z-1 fixed w-full p-4 text-white flex bg-slate-950 '>
        <div className='p-2'>
           <Link className='p-2 hover:font-semibold border-2 border-transparent rounded hover:bg-slate-500' to={'/'}>Home</Link>
           <Link className='p-2 hover:font-semibold border-2 border-transparent rounded hover:bg-slate-500' to={'/analyzer'}>Analyzer</Link>
           
        </div>
        <div className='ml-auto'>
            <props.GoogleSignOutButton />
        </div>
    </div>
  )
}

export default Navbar