import React, { useEffect, useState, useRef } from 'react'
import { analyzeResponse, getQuestions } from '../Api';
import { useAnalyzeResume } from '../Components/AnalyzeResumeContext';
import Loading from '../Components/Loading';
import AlertUser from '../Components/AlertUser';

function Analyzer({user}) {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [response, setResponse] = useState([]);
    const [disable, setDisable] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState(null);


    
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
        setIsLoading(true);
        if(!user.fileId) {
            setAlertMessage('No Resume Found');
            setAlertSeverity('error');
            setAlertOpen(true);
            setIsLoading(false);
            return;
        }

        setAlertMessage('Analyzing Resume');
        setAlertSeverity('info');
        setAlertOpen(true);

        await getQuestions(user.googleId, user.fileId).then((res) => {
            setQuestions(res.questions);
            setAnswers(Array(questions.length).fill(''))
            setResponse([]);
        })

        setAlertOpen(false);
        setDisable(true);
        setIsLoading(false);
    }

    const handleAnswerChange = (index, value) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);

        const textarea = document.getElementById(`textarea-${index}`);
        const current = document.getElementById(`current-${index}`);
        const maximum = document.getElementById(`maximum-${index}`);
        const theCount = document.getElementById(`the-count-${index}`);

        textarea.addEventListener('input', function() {
            var characterCount = this.value.length;
            current.textContent = characterCount;

            if (characterCount < 500) {
                current.style.color = '#fff';
            }
            if (characterCount > 500 && characterCount < 1100) {
                current.style.color = '#FFAF00';
            }
            if (characterCount > 1100 && characterCount < 1600) {
                current.style.color = '#FF8300';
            }
            if (characterCount > 1600 && characterCount < 1750) {
                current.style.color = '#FF4800';
            }
            if (characterCount > 1750 && characterCount < 1900) {
                current.style.color = '#FF0000 ';
            }
            
            if (characterCount >= 1900) {
                maximum.style.color = '#FF0000 ';
                current.style.color = '#FF0000 ';
                theCount.style.fontWeight = 'bold';
            } else {
                maximum.style.color = '#fff';
                theCount.style.fontWeight = 'normal';
            }
        });      
    };

    async function handleAnalyze() {
        setIsLoading(true);

        setAlertMessage('Analyzing Response');
        setAlertSeverity('info');
        setAlertOpen(true);

        await analyzeResponse(user.fileId, {'questions':questions, 'answers':answers}).then((res) => {
            setResponse(res.feedback);
        })

        setAlertOpen(false);
        setIsLoading(false);
    }

    return (
        <>
        <AlertUser open={alertOpen} setOpen={setAlertOpen} message={alertMessage} severity={alertSeverity}/>
        {isLoading && (
            <div className='fixed mt-12 md:mt-18 overflow-hidden h-full w-full flex items-center justify-center bg-slate-950 opacity-50'>
                <Loading/>
            </div>
        )}
        <div className='bg-slate-950 text-white h-screen w-full flex flex-col p-4 pt-20 overflow overflow-y-auto text-sm md:text-base'>
            
            <div className='text-xl sm:text-2xl md:text-4xl text-left p-4 font-bold'> Hello, {user.name}</div>

            <div className='p-4 text-left '>
                <button onClick={getQ} 
                    className='border-2 border-green-700 bg-green-700 uppercase font-bold text-xs md:text-sm p-2 md:p-2 md:px-4 mb-4 rounded-lg hover:bg-green-800 md:w-1/4 rounded'> 
                        Analyze Resume 
                </button>

                <div className='pt-4'>
                    
                        {questions && questions.length > 0 && (
                            <ul>
                                {questions.map((question, index) => (
                                    <li key={index}>
                                        <div className='bg-slate-900 text-md rounded p-2 font-semibold'>
                                            {question}
                                        </div>
                                        <div className='pb-2'>
                                            <textarea
                                                type='text'
                                                className='w-full h-32 bg-slate-800 rounded p-2'
                                                placeholder=''
                                                value={answers[index]}
                                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                                                maxLength='2000'
                                                id={`textarea-${index}`}
                                            />
                                            <div id={`the-count-${index}`} className='pb-2 w-full text-right text-xs md:text-sm opacity-90 ' >
                                                <span id={`current-${index}`}>0</span>
                                                <span id={`maximum-${index}`}>/2000</span>
                                            </div>
                                        </div>
    
                                        {response.length > 0 && response && (
                                            <div className="p-2 pb-6 text-left text-xs sm:text-sm md:text-base text-yellow-400 rounded">
                                                <p> » {response[index]}</p>
                                            </div>
                                        )}
    
                                    </li>
                                    
                                    ))} 
                            </ul>
                        )}
                </div>

            </div>
            <div className='text-right'>
                <button onClick={handleAnalyze} className={disable ? 'border-2 border-green-700 bg-green-700 uppercase font-bold text-xs md:text-sm p-2 md:p-2 md:px-4 mb-4 rounded-lg hover:bg-green-800 md:w-1/4 rounded' : 'hidden'}> Analyze response </button>
            </div>


        </div>

        </>
    )
}

export default Analyzer