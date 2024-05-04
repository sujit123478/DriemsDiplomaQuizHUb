import React from 'react'
import { useNavigate } from 'react-router-dom';

function Instruction({examData , view,setView, startTimer}) {
  const navigate = useNavigate();
  return (
  
    <div className='flex flex-col item-center gap-2 mt-2'>
      <h1 className='text-2xl underline text-center'>Instructions</h1>
      <ul className='flex flex-col gap-1'>
           <li>Exam must be completed in {examData.duration} seconds.</li>
           <li>Exam will be submitted automatically after {examData.duration} seconds.</li>
           <li>Once submitted , you can't change your answers.</li>
           <li>Don't refresh the page.</li>
           <li>
            You can use the <span className='font-bold'>"Previous"</span> and{""}
            <span className='font-bold'>"Next"</span> button to navigate between the question.
           </li>
           <li>
            You can use the <span className='font-bold'>"Previous"</span> and{""}
            <span className='font-bold'>"Next"</span> button to navigate between the question.
           </li>
           <li>Total mark of the exam is <span className='font-bold'>{examData.totalMark}</span></li>
           <li>Passing Marks of the exam is <span className='font-bold'>{examData.passingMark}</span></li>
      </ul>
      <div className='flex gap-2'>
        <button className='primary-outlined-btn' onClick={()=>{
          navigate('/');
        }}>
          Close
        </button>
      <button className='primary-contend-btn' onClick={()=>{
        startTimer();
        setView('questions');
      }} >Start Exam</button>
      </div>
    </div>
  )
}

export default Instruction;