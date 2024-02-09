import React, { useState } from 'react'
import { uploadFile } from './Api';

function Home() {
  const [file, setFile] = useState(null);
  const [data,setData] = useState("");

  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    uploadFile(file).then((res) => {
      setData(res)
    })
  }

  return (
    <div className='bg-slate-950 text-white h-screen w-full flex justify-center items-center flex flex-col'>
        <form className='flex flex-col' onSubmit={handleSubmit}>
            <input type='file' accept='pdf' className='p-2' onChange={handleFileChange}/>
            <button type='submit' className='bg-green-700 p-2 rounded-lg hover:bg-green-800 m-2 w-1/3'>
              Upload
            </button>
        </form>


        <div className='h-1/2 w-1/2 overflow-scroll hide-scrollbar'>
          {data}
        </div>
    </div>
  )
}

export default Home
