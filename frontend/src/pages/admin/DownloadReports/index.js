import React, { useState ,useEffect } from 'react'
import {  getAllReports } from '../../../apiCalls/reports';
import * as XLSX from 'xlsx';
import { setUser } from '../../../redux/userSlice';
import {useSelector} from 'react-redux';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import { message} from 'antd';
import { getUserInfo } from '../../../apiCalls/user';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
function DownloadReports({children}) {
  const {user}=useSelector((state)=> state.users);
  const [menu,setMenu] = useState([]);
  const [collapsed,setCollapsed] = useState();
  const navigate=useNavigate();
  const dispatch = useDispatch();
const userManu =[
  {
    title:"Home",
    path:['/','/user/write-exam'],
    icon:<i className="ri-home-line"></i>,
    onClick:() => navigate("/")
  },
  {
    title:"Reports",
    path:['/user/reports'],
    icon:<i className="ri-bar-chart-line"></i>,
    onClick:()=> navigate("/user/reports")
  },
  {
    title:"Profile",
    path:["/profile"],
    icon:<i className="ri-user-line"></i>,
    onClick:()=>navigate("/profile")
  },
  {
    title:"Logout",
    path:["/logout"],
    icon:<i className="ri-logout-circle-line"></i>,
    onClick:()=>{
      localStorage.removeItem("token");
      navigate("/login");
    }
  }
];

const adminMenu = [
  {
    title:"Home",
    path:['/' ,'/user/write-exam'],
    icon:<i className="ri-home-line"></i>,
    onClick:() => navigate("/")
  },
  {
    title:"Exam",
    path:['/admin/exams', '/admin/exams/add'],
    icon:<i className="ri-file-list-line"></i>,
    onClick:()=> navigate("/admin/exams")
  },
  {
    title:"Reports",
    path:['/admin/reports'],
    icon:<i className="ri-bar-chart-line"></i>,
    onClick:()=> navigate("/admin/reports")
  },
  {
    title:"Profile",
    path:["/profile"],
    icon:<i className="ri-user-line"></i>,
    onClick:()=>navigate("/profile")
  },
  {
    title:"Logout",
    path:["/logout"],
    icon:<i className="ri-logout-circle-line"></i>,
    onClick:()=>{
      localStorage.removeItem("token");
      navigate("/login");
    }
  }
];
const getUserData =async () =>{
  try {
    dispatch(ShowLoading());
    const response= await getUserInfo();
    dispatch(HideLoading());
    if(response.success){
      message.success(response.message);
      dispatch(setUser(response.data));
      if(response.data.isAdmin){
        setMenu(adminMenu);
      }else{
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
useEffect(()=>{
    if(localStorage.getItem("token")){
          getUserData();
    }else{
      navigate('/login');
    }
  }
  ,
  []
  );
  const activeRoute =window.location.pathname;

  const getIsActiveOrNot = (paths) => { 
      if (paths.includes(activeRoute)) {
        return true;
      }else{
        if(activeRoute.includes('/admin/exams/edit')&& paths.includes('/admin/exams')){
          return true;
        }
        if(activeRoute.includes('/user/write-exam') && paths.includes('/user/write-exam')){
          return true;
        }
        if(activeRoute.includes('/admin/downloadReports') && paths.includes('/admin/reports')){
          return true;
        }
        return false;
      }
  }




  const [filters, setFilters] = useState({
    examName: "",
    userName: ""
  });
  const fetchedReports = async () => {
    const userReports=[];
    const response = await getAllReports(filters);
    if (response.success) {
      const reports = response.data;
      reports.forEach(report => {
      const User_Name = report.user.name;
      const Registration_Number=report.user.RegistrationNumber;
      const Total_Mark = report.exam.totalMark;
      const Passing_Mark = report.exam.passingMark;
      const Correct_AnswersCount = report.result.correctAnswers.length;
      const Wrong_AnswersCount = report.result.wrongAnswers.length;
      const Obtain_Mark = Correct_AnswersCount;
      const Result = report.result.verdict;
      const resultObject = {
        User_Name,
        Registration_Number,
        Total_Mark,
        Passing_Mark,
        Obtain_Mark,
        Result,
      };
      userReports.push(resultObject)
      });

     generateExcelFile(userReports);
    }
    
  }
  const generateExcelFile = (data) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reports');
    // Save the workbook as an Excel file
    XLSX.writeFile(wb, 'userReports.xlsx');
    
  };
  return (
    <div>
    <div className='layout'>
      <div className='flex gap-2'>
        <div className='body'>
          <div className='header flex justify-between'>
            {!collapsed && <i className="ri-menu-line" onClick={() => {
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
        <div className={` p-1 ${collapsed ? `homeHide` : ``}`}>
      <label>Enter Exam Name</label>
      <input type='text' className='mt-1' placeholder='Exam Name'
        value={filters.examName}
        onChange={(e) => setFilters({ ...filters, examName: e.target.value })}
      ></input>
      <button className='mt-2 gen-btn' onClick={() => {
        fetchedReports()
      }}>Generate Report</button>
    <div/>
      </div>
    </div>
  </div>
  </div>
  )
}

export default DownloadReports