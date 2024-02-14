import React, { useState } from 'react'
import { getQuestions, uploadFile } from '../Api';

function Home() {
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [resumeData, setResumeData] = useState("");

  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await uploadFile(file).then((res) => {
      setResumeData(res.data)
    })

    await getQuestions().then((res) => {
      setQuestions(res.questions.split('\n').map(question => question.trim()))
    })

  }

  return (
    <div className='bg-slate-950 text-white h-screen w-full flex justify-center items-center flex flex-col'>
      <div className='text-8xl font-bold p-2 tracking-widest'>Mind Meld</div>

      <div className=''>
        <form className='flex flex-col' onSubmit={handleSubmit}>
            <input type='file' accept='pdf' className='p-2' onChange={handleFileChange}/>
            <button type='submit' className='bg-green-700 p-2 rounded-lg hover:bg-green-800 m-2 w-1/3'>
              Upload
            </button>
        </form>
      </div>
 
      
        <div className='h-1/2 w-3/4 overflow-scroll hide-scrollbar text-white'>
          {resumeData &&  questions.length <=0 && <div> Analyzing resume... </div>}
          {questions && questions.length > 0 && (
            <ul>
              {questions.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ul>
          )}
        </div>
    </div>
  )
}

export default Home
