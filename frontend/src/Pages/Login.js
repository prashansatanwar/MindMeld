import React, { useEffect, useState } from 'react'

function Login(props) {
    return (
        <div className='bg-slate-950 text-white h-screen w-full flex justify-center items-center'>

            <div className='w-full flex p-20'>
                <div className='p-8 w-2/3 text-left'>
                    <div className='text-6xl font-bold p-2'> 
                        Mind Meld
                    </div>
                    <div className='p-2'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, voluptate asperiores! Sint voluptatum blanditiis quis quidem ex quia molestias illo vel, animi praesentium maxime distinctio nihil at amet repellendus tempora!
                    </div>
                </div>
                <div className='flex justify-center items-center'>
                    { !props.isLoggedIn && <props.GoogleSignInButton/> }
                </div>
            </div>
        </div>
    )
}

export default Login