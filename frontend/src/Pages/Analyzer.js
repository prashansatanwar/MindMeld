import React, { useEffect, useState, useRef } from 'react'
import { analyzeResponse, getQuestions } from '../Api';
import { useAnalyzeResume } from '../Components/AnalyzeResumeContext';

function Analyzer({user}) {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [response, setResponse] = useState([]);
    const [disable, setDisable] = useState(false);

    const [loading, setLoading] = useState(false);

    
  const isEffectTriggered = useRef(false);

    const { analyzeResumeClicked, setAnalyzeResumeClicked } = useAnalyzeResume();

    useEffect(() => {
        if(analyzeResumeClicked && !isEffectTriggered.current) {
            isEffectTriggered.current = true;
            setAnalyzeResumeClicked(false);
            getQ();
        }
    },[analyzeResumeClicked])

    async function getQ() {
        setLoading(true);
        await getQuestions(user.googleId, user.fileId).then((res) => {
            setQuestions(res.questions);
            setAnswers(Array(questions.length).fill(''))
            setResponse([]);
        })

        setDisable(true);
        setLoading(false);
    }

    const handleAnswerChange = (index, value) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    async function handleAnalyze() {
        setLoading(true);
        await analyzeResponse(user.fileId, {'questions':questions, 'answers':answers}).then((res) => {
            setResponse(res.feedback);
            console.log(res)
        })
        setLoading(false);
    }


    return (
        <div className='bg-slate-950 text-white h-screen w-full flex flex-col p-4 pt-20 overflow overflow-y-scroll'>
            <div className='text-4xl text-left p-4'> Hello, {user.name}</div>

            <div className='p-4 text-left '>
                <button onClick={getQ} className='border-2 border-green-700 bg-green-700 uppercase font-bold text-sm p-2 px-4 rounded-lg hover:bg-green-800 w-1/5 rounded'> Analyze Resume </button>

                <div className='pt-4'>
                    {loading && (
                        <div>
                            loading...
                        </div>
                    )}
                    
                    {questions && questions.length > 0 && (
                        <ul>
                            {questions.map((question, index) => (
                                <li key={index}>
                                    <div className='bg-slate-900 text-md pt-2 '>
                                        {question}
                                    </div>
                                    <textarea
                                        type='text'
                                        className='w-full h-32 bg-slate-800'
                                        placeholder=''
                                        value={answers[index]}
                                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                                    />

                                    {response && (
                                        <div className="p-4 text-left text-yellow-400">
                                            <p>{response[index]}</p>
                                        </div>
                                    )}

                                </li>
                                
                                ))} 
                        </ul>
                    )}

                </div>

            </div>
            <div className='text-right'>
                <button onClick={handleAnalyze} className={disable ? 'border-2 border-green-700 bg-green-700 uppercase font-bold text-sm p-2 px-4 rounded-lg hover:bg-green-800 w-1/5 rounded mx-2' : 'hidden'}> Analyze response </button>
            </div>


        </div>
    )
}

export default Analyzer