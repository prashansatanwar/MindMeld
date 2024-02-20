import React from 'react'

function Dashboard({user}) {
  return (
    <div className='bg-slate-950 text-white h-screen w-full flex p-4 pt-20'>
        <div className='text-4xl'> Welcome {user.name}!</div>
    </div>
  )
}

export default Dashboard