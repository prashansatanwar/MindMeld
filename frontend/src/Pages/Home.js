import React, { useEffect, useState } from 'react'
import { getQuestions, uploadFile, getFile, deleteFile, getUser } from '../Api';
import { Document, Page } from 'react-pdf';

function Home({user, setUser}) {
  console.log(user)
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState();
  const [url, setUrl] = useState('');

  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  useEffect(() => {
      const fetchData = async () => {
          if (user.fileId) {
              try {
                  const response = await getFile(user.googleId, user.fileId);
                  setUploadedFile(response);
              } catch (error) {
                  console.error('Error fetching file:', error);
              }
          }
      };

      fetchData();

      console.log(uploadedFile)
  }, [user.fileId, user.googleId]);


  useEffect(() => {
    console.log(file)
    file && setUrl(URL.createObjectURL(file))
  }, [file]);

  async function handleSubmit(e) {
    e.preventDefault();
    await uploadFile(file,user.googleId).then((res) => {
      console.log(res)
    })
    await getUser(user.googleId).then((res) => {
      setUser(res);
      localStorage.setItem('userData',JSON.stringify(res));
    })

    
  }
  
  return (
    <div className='bg-slate-950 text-white h-screen w-full flex justify-center items-center flex flex-col py-20'>
      <div className='text-8xl font-bold p-2 m-2 tracking-widest'>Mind Meld</div>

      <div className='w-full px-4 mb-2'>
        <form className='flex' onSubmit={handleSubmit}>
          <div className='flex-grow flex'>

            <input type='file' accept='pdf' className='custom-file-input' id='file-input' onChange={handleFileChange} />
            <label className="custom-file-label px-2 m-2 rounded-lg" for="file-input">
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="upload"
                className="svg-inline--fa fa-upload fa-w-16"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"
                ></path>
              </svg>
              <span>Choose PDF file</span>
            </label>

          </div>
            <button type='submit' 
            className='border-2 border-green-700 uppercase font-bold text-sm p-2 px-4 rounded-lg hover:bg-green-800 m-2 '
            >
              Upload
            </button>
        </form>
      </div>

        <div className='flex-grow w-[95%]  px-8 text-left text-white'>
            <div className='bg-slate-800 h-full p-4 rounded'>
              {uploadedFile 
                ? <iframe src={`data:application/pdf;base64,${uploadedFile.content}`} className='h-full w-full' />
                : (url 
                  ? <iframe src={url} className='h-full w-full' />
                  : <div> No file chosen or uploaded. </div>)}
            </div>
        </div>
      
    </div>
  )
}

export default Home
