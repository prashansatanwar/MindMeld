import React, { useEffect, useState } from 'react'

function Login(props) {
    return (
        <div className='bg-slate-950 text-white h-screen w-full flex justify-center items-center'>

            <div className='w-full flex p-20'>
                <div className='p-8 w-2/3 text-left'>
                    <div className='text-6xl font-bold p-1 font-megrim tracking-wider border-b-2 mb-5'> 
                        Mind Meld
                    </div>
                    <div className='p-2 font-0'>
                    Enhance interview skills with our app! Upload your resume, receive tailored questions, and practice responses like a real interview. 
                    Our app analyzes your answers, providing valuable feedback for improvement. 
                    Perfect for honing your skills and boosting confidence before the big day.
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