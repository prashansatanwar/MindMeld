import React, { useEffect, useState } from 'react'
import { getQuestions, uploadFile } from '../Api';
import { Document, Page } from 'react-pdf';

function Home() {
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [resumeData, setResumeData] = useState("");
  const [url, setUrl] = useState('');

  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  useEffect(() => {
    file && setUrl(URL.createObjectURL(file))
  }, [file]);

  async function handleSubmit(e) {
    e.preventDefault();
    await uploadFile(file).then((res) => {
      setResumeData(res.data)
    })

    // await getQuestions().then((res) => {
    //   setQuestions(res.questions.split('\n').map(question => question.trim()))
    // })

  }

  // const PDFViewer = () => {
  //     const pdfURL = url;
  //     return (
  //       <div>
  //       {/* <Document file={pdfURL}>
  //         <Page pageNumber={1} />
  //       </Document> */}

  //         <iframe src={pdfURL} className='h-full w-full ' />
  //       </div>
  //       );
  //   };

  return (
    <div className='bg-slate-950 text-white h-screen w-full flex justify-center items-center flex flex-col py-20'>
      <div className='text-8xl font-bold p-2 m-2 tracking-widest'>Mind Meld</div>

      <div className='w-full px-4 mb-2'>
        <form className='flex' onSubmit={handleSubmit}>
            <input type='file' accept='pdf' className='p-2 flex-grow' onChange={handleFileChange} />
            <button type='submit' className='bg-green-700 p-2 px-4 rounded-lg hover:bg-green-800 m-2 '>
              Upload
            </button>
        </form>
      </div>
 
        {/* <div className='h-1/2 w-full  px-8 text-left text-white'>
          <div className='bg-slate-800 h-full p-4 rounded overflow-scroll hide-scrollbar'>
            {resumeData &&  questions.length <=0 && <div> Analyzing resume... </div>}
            {questions && questions.length > 0 && (
              <ul>
                {questions.map((question, index) => (
                  <li key={index}>{question}</li>
                ))} 
              </ul>
            )}

            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quas atque quod reprehenderit debitis expedita voluptatibus asperiores. Asperiores molestias nisi corporis architecto cupiditate rem commodi, earum voluptates. Suscipit laboriosam inventore quibusdam?
            <Viewer fileUrl={url}/>
          </div>
        </div> */}

        <div className='flex-grow w-[95%]  px-8 text-left text-white'>
            <div className='bg-slate-800 h-full p-4 rounded'>
              {url 
                ? <iframe src={url} className='h-full w-full' />
                : <div> No file chosen </div>}
            </div>
        </div>
      
    </div>
  )
}

export default Home
