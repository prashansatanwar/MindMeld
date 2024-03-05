import React from 'react'
import { useNavigate } from 'react-router-dom';

function PageNotFound() {
    let navigate = useNavigate(); 
    return (
        <div className='h-screen w-full text-white bg-slate-950 flex justify-center items-center'>
            <div className="container flex flex-col items-center ">
                <div className="flex flex-col gap-4 w-1/2 text-center">
                    <div className="font-extrabold text-8xl md:text-9xl text-gray-600 dark:text-gray-100">
                        404
                    </div>
                    <div className="text-xl md:text-2xl dark:text-gray-300">Sorry, we couldn't find this page.</div>
                    <div>
                        <button onClick={() => navigate('/')} className="px-4 py-2 text-xl font-semibold rounded bg-gray-600 text-gray-50 hover:text-gray-200 w-1/2">Back to home</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PageNotFound