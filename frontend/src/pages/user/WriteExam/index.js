import { message } from 'antd';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import { getExamById } from '../../../apiCalls/exams';
import Instruction from './Instruction';
import { addReport } from '../../../apiCalls/reports';
import { setUser } from '../../../redux/userSlice';
import { getUserInfo } from '../../../apiCalls/user';

function WriteExam({children}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [examData, setExamData] = useState();
  const [view, setView] = useState("instructions");
  const [result, setResult] = useState({ correctAnswers: [], wrongAnswers: [], verdict: '' });
  const [questions = [], setQuestions] = useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState({});
  const [secondLeft, setSecondLeft] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const { user } = useSelector(state => state.users);
  const [menu, setMenu] = useState([]);
  const [collapsed, setCollapsed] = useState();

  const userManu = [
    {
      title: "Home",
      path: ['/', '/user/write-exam'],
      icon: <i className="ri-home-line"></i>,
      onClick: () => navigate("/")
    },
    {
      title: "Reports",
      path: ['/user/reports'],
      icon: <i className="ri-bar-chart-line"></i>,
      onClick: () => navigate("/user/reports")
    },
    {
      title: "Profile",
      path: ["/profile"],
      icon: <i className="ri-user-line"></i>,
      onClick: () => navigate("/profile")
    },
    {
      title: "Logout",
      path: ["/logout"],
      icon: <i className="ri-logout-circle-line"></i>,
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  ];

  const adminMenu = [
    {
      title: "Home",
      path: ['/', '/user/write-exam'],
      icon: <i className="ri-home-line"></i>,
      onClick: () => navigate("/")
    },
    {
      title: "Exam",
      path: ['/admin/exams', '/admin/exams/add'],
      icon: <i className="ri-file-list-line"></i>,
      onClick: () => navigate("/admin/exams")
    },
    {
      title: "Reports",
      path: ['/admin/reports'],
      icon: <i className="ri-bar-chart-line"></i>,
      onClick: () => navigate("/admin/reports")
    },
    {
      title: "Profile",
      path: ["/profile"],
      icon: <i className="ri-user-line"></i>,
      onClick: () => navigate("/profile")
    },
    {
      title: "Logout",
      path: ["/logout"],
      icon: <i className="ri-logout-circle-line"></i>,
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  ];
  const getUserData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getUserInfo();
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        dispatch(setUser(response.data));
        if (response.data.isAdmin) {
          setMenu(adminMenu);
        } else {
          setMenu(userManu);
        }
      }
      else {
        navigate("/login");
      }
    } catch (error) {
      navigate('/login');
      dispatch(HideLoading());
      message.error(error.message);
    }
  }
  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUserData();
    } else {
      navigate('/login');
    }
  }
    ,
    []
  );
  const activeRoute = window.location.pathname;

  const getIsActiveOrNot = (paths) => {
    if (paths.includes(activeRoute)) {
      return true;
    } else {
      if (activeRoute.includes('/admin/exams/edit') && paths.includes('/admin/exams')) {
        return true;
      }
      if (activeRoute.includes('/user/write-exam') && paths.includes('/user/write-exam')) {
        return true;
      }
      return false;
    }
  }


  const getExamData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getExamById({
        examId: params.id
      });
      dispatch(HideLoading());
      if (response.success) {
        setExamData(response.data);
        setQuestions(response.data.questions);
        setSecondLeft(response.data.duration);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }
  const calculateResults = async () => {
    try {
      let correctAnswers = [];
      let wrongAnswers = [];
      questions.forEach((questions, index) => {
        if (questions.correctOption === selectedOption[index]) {
          correctAnswers.push(questions);
        }
        else {
          wrongAnswers.push(questions);
        }
      });
      let verdict = "fail";
      if (correctAnswers.length >= examData.passingMark) {
        verdict = "pass";
      }
      const tempResults = {
        correctAnswers,
        wrongAnswers,
        verdict
      }
      setResult(tempResults);
      dispatch(ShowLoading());
      const response = await addReport(
        {
          exam: params.id,
          result: tempResults,
          user: user._id
        }
      );
      dispatch(HideLoading());
      if (response.success) {
        setView("result");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };
  const startTimer = () => {
    let remainingSeconds = examData.duration;
    const intervalId = setInterval(() => {
      if (remainingSeconds > 0) {
        remainingSeconds = remainingSeconds - 1;
        setSecondLeft(remainingSeconds);
      } else {
        clearInterval(intervalId);
        setTimeUp(true);
      }
    }, 1000);
  };

  useEffect(() => {
    if (timeUp) {
      clearInterval(intervalId);
      calculateResults();
    }
  }, [timeUp]);
  useEffect(() => {
    if (params.id) {
      getExamData();
    }
  }, [])
  return (
    examData &&
    <div className='writeExamBox'>
      <div className='layout'>
        <div className='flex gap-2'>
          <div className='body'>
            <div className='header flex justify-between'>
              {!collapsed && <i  className="ri-menu-line" onClick={() => {
                setCollapsed(true);
              }}></i>}
              {collapsed && <i className="ri-close-line" onClick={() => {
                setCollapsed(false)
              }
              }
              ></i>}
              <h1 className='text-2xl'>Driems polytechnic Quiz app</h1>
              <div className='flex flex-col'>
                <div className='flex gap-1 item-center '>
                  <i className="ri-user-line"></i>
                  <h1 className='text-xl'>{user?.name}</h1>
                </div>
                <span>Role : {user?.isAdmin ? "Admin" : "User"}</span>
              </div>

            </div>
            <div className='content'>{children}</div>
          </div>
        </div>

        <div className='flex'>
          {collapsed && <div className='sidebar' >
            {
              menu.map((item, index) => {
                return <div className={`menu-item ${getIsActiveOrNot(item.path) && "active-menu-item"}`}
                  key={index} onClick={item.onClick}
                >
                  {item.icon}
                  {<span className=''>{item.title}</span>}
                </div>
              })
            }
          </div>}
          <div className={`home ${collapsed ? `homeHide` : ``}`}>
            <div>
              <div className='divider mt-2'></div>
              <h1 className='text-center'>{examData.name}</h1>
              <div className='divider'></div>
              {view === "instructions" && <Instruction examData={examData} view={view} setView={setView} startTimer={startTimer} />}
              {view === "questions" &&
                <div className='flex flex-col gap-2 mt-2'>
                  <div className='flex justify-between'>
                    <h1 className='text-2xl'>
                      {selectedQuestionIndex + 1} : {questions[selectedQuestionIndex].name}
                    </h1>
                    <div className='timer'>
                      <h1 className='text-2xl'>{secondLeft}</h1>
                    </div>
                  </div>
                  <div className='flex flex-col gap-2'>
                    {Object.keys(questions[selectedQuestionIndex].options).map((option, index) => {
                      return (
                        <div className={`flex gap-2 flex-col ${selectedOption[selectedQuestionIndex] == option ? "selected-option" : "option"}`} key={index} onClick={() => {
                          setSelectedOption({
                            ...selectedOption,
                            [selectedQuestionIndex]: option,
                          })
                        }}>
                          <h2 >
                            {option}:{questions[selectedQuestionIndex].options[option]}
                          </h2>
                        </div>)
                    })}
                  </div>
                  <div className='flex justify-between'>
                    {selectedQuestionIndex > 0 && <button
                      className='primary-outlined-btn'
                      onClick={
                        () => {
                          setSelectedQuestionIndex(selectedQuestionIndex - 1);
                        }
                      }>
                      previous
                    </button>}
                    {selectedQuestionIndex < questions.length - 1 && <button
                      className='primary-contend-btn'
                      onClick={
                        () => {
                          setSelectedQuestionIndex(selectedQuestionIndex + 1);
                        }
                      }>
                      Next
                    </button>}
                    {selectedQuestionIndex === questions.length - 1 && <button
                      className='primary-contend-btn'
                      onClick={
                        () => {
                          clearInterval(intervalId);
                          setTimeUp(true);

                        }
                      }>
                      Submit
                    </button>}
                  </div>
                </div>
              }
              {view === "result" &&
                <div className='flex justify-center mt-2 item-center'>
                  <div className='flex flex-col gap-2 result'>
                    <h1 className='text-2xl'>Result</h1>
                    <div className='mark'>
                      <h1 className='text-md'>Total Marks : {examData.totalMark} </h1>
                      <h1 className='text-md'>Obtain Marks : {result.correctAnswers.length}</h1>
                      <h1 className='text-md'>wrongAnswers Marks : {result.wrongAnswers.length}</h1>
                      <h1 className='text-md'>Passing Mark : {examData.passingMark}</h1>
                      <h1 className='text-md'>VERDICT : {result.verdict} </h1>
                      <div className='mt-2 flex gap-2'>
                        <button className='primary-contend-btn' onClick={() => {
                          setView("review");
                        }}>Preview</button>
                      </div>
                    </div>
                  </div>
                  <div className='lottie-animation'>
                    {result.verdict === "pass" && <dotlottie-player src="https://lottie.host/2f687b21-bb87-42e4-963c-37290d0ad731/VgwFeqc4HZ.json" background="transparent" speed="1" loop autoplay></dotlottie-player>}
                    {result.verdict === "fail" && <dotlottie-player src="https://lottie.host/fe6ff48c-d3a2-47ef-b45f-5414f4092df7/roTcOs73ez.json" background="transparent" speed="1" loop autoplay></dotlottie-player>}
                  </div>
                </div>
              }
              {view === "review" && <div className='flex flex-col gap-2'>
                {
                  questions.map((questions, index) => {
                    const isCorrect = questions.correctOption === selectedOption[index];
                    return (

                      <div className={`flex flex-col gap-1 p-2 card ${isCorrect ? "correct" : "wrong"}`}>
                        <h1 className='text-xl'>
                          {index + 1}:{questions.name}
                        </h1>
                        <h1 className='text-md'>
                          Submited Answer :{selectedOption[index]} - {questions.options[selectedOption[index]]}
                        </h1>
                        <h1 className='text-md'>
                          Correct Answers :{questions.correctOption} - {questions.options[questions.correctOption]}
                        </h1>
                      </div>
                    )
                  })
                }
                <div className='flex justify-center gap-2'>
                  <button className='primary-outlined-btn' onClick={() => {
                    navigate('/');
                  }}>
                    Close
                  </button>
                </div>
              </div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WriteExam;