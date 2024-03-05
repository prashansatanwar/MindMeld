import React, { useEffect, useState } from 'react'
import { uploadFile, getFile, getUser } from '../Api';
import { useNavigate } from 'react-router-dom';
import { useAnalyzeResume } from '../Components/AnalyzeResumeContext';

import Loading from "../Components/Loading";
import AlertUser from "../Components/AlertUser";

function Home({user, setUser}) {
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [url, setUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertSeverity, setAlertSeverity] = useState(null);

  const navigate = useNavigate();

  const { clickAnalyzeResume } = useAnalyzeResume();

  function handleFileChange(e) {
    const f = e.target.files[0];
    if(!f?.name.endsWith('.pdf')) {
      setAlertMessage('You can upload pdf files only.');
      setAlertSeverity('warning')
      setAlertOpen(true);
      return;
    }
    setFile(f);
    setUploadedFile('');
  }

  useEffect(() => {
    setIsLoading(true);
    file && setUrl(URL.createObjectURL(file)) 
    setIsLoading(false);
  }, [file]);

  useEffect(() => {
    setIsLoading(true);
      const fetchData = async () => {
        if (user.fileId) {
          try {
            const response = await getFile(user.googleId, user.fileId);
            setUploadedFile(response);
          } catch (error) {
            console.error('Error fetching file:', error);
            setAlertMessage('Error fetching file.');
            setAlertSeverity('error')
            setAlertOpen(true);
          }
        }
        setIsLoading(false);
      };
      
      fetchData();
  }, [user.fileId, user.googleId]);

  async function handleSubmit(e) {
    e.preventDefault();
    await uploadFile(file,user.googleId).then((res) => {
      setFile('')
      setAlertOpen(true);
      setAlertMessage('File Uploaded');
      setAlertSeverity('success');
    })
    await getUser(user.googleId).then((res) => {
      setUser(res);
      localStorage.setItem('userData',JSON.stringify(res));
    })    
  }

  function handleAnalyze() {
    clickAnalyzeResume();
    navigate('/analyzer');
  }

  function handleBack() {
    setFile(null);
    setUrl(null);
    window.location.reload();
  }
  
  return (
    <div className='bg-slate-950 text-white h-screen w-full flex justify-center items-center flex flex-col py-10 sm:pt-24 sm:pb-4 md:py-20 overflow-y-auto'>
      <AlertUser open={alertOpen} setOpen={setAlertOpen} message={alertMessage} severity={alertSeverity}/>
      <div className='text-4xl sm:text-6xl md:text-7xl lg:text-8xl uppercase font-bold p-2 mt-20 mb-8 tracking-widest font-megrim'>
        Mind Meld
      </div>

      <div className='w-[90%] flex flex-col h-full rounded-lg p-4 bg-slate-700 '>
          <div className='flex mb-4 flex-col sm:flex-row text-sm sm:text-base'>
            <form className='flex-grow flex ' onSubmit={handleSubmit}>
              <div className='flex-grow flex '>

                <input type='file' accept='pdf' className='custom-file-input' id='file-input' onChange={handleFileChange} />
                <label title='Select another pdf file' className="custom-file-label xsm:w-full sm:w-auto border-2 border-blue-800 bg-blue-800 hover:bg-blue-900 p-2 m-2 rounded-lg" htmlFor="file-input">
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

                  {uploadedFile 
                    ? <span> {uploadedFile.filename }</span>
                    : file
                      ? <span> {file.name} </span>
                      : <span> Choose PDF file </span>}
                </label>
              </div>

              {file && (
                <div className='m-2 ml-auto'>
                  <button className='border-2 border-yellow-700 uppercase font-bold text-xs sm:text-sm p-2 px-4 rounded-lg hover:bg-yellow-800 mx-2'
                          onClick={handleBack}> Back </button>
                  <button type='submit' 
                    className='border-2 border-green-700 uppercase font-bold text-xs sm:text-sm p-2 px-4 rounded-lg hover:bg-green-800'>
                      upload
                  </button>
                </div>
              )}
            </form>

              {uploadedFile && !file && (
                <button
                  className='border-2 border-green-800 uppercase font-bold text-xs sm:text-sm p-2 px-4 rounded-lg bg-green-800 hover:bg-green-900 m-2 sm:ml-auto'
                  onClick={handleAnalyze} > 
                    Analyze Resume 
                </button>
              )}
          </div>

          <div className='flex-grow h-full text-left text-white overflow-y-auto'>
              <div className='bg-slate-800 h-full md:p-2 rounded'>
                {
                  isLoading 
                    ? <div className='h-full w-full flex items-center justify-center'><Loading/></div>
                    : uploadedFile 
                      ? <iframe src={`data:application/pdf;base64,${uploadedFile.content}`} className='h-full w-full' />
                      : (url
                        ? <iframe src={url} className='h-full w-full' />
                        : <div> No file chosen or uploaded. </div>)

                }
              </div>
          </div>

          
      </div>

      
    </div>
  )
}

export default Home
