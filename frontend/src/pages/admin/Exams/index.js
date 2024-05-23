import React,{useEffect} from 'react'
import PageTitles from '../../../component/PageTitles';
import { useNavigate } from 'react-router-dom';
import {Table} from 'antd';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import { message } from 'antd';
import { deleteExamById, getAllExams } from '../../../apiCalls/exams';
import { getUserInfo } from '../../../apiCalls/user';
import {useSelector} from 'react-redux';
import { setUser } from '../../../redux/userSlice';
import { useState } from 'react';
function Exams({children}) {
  const navigate= useNavigate();
  const [exams,setExams]= React.useState([]);
  const dispatch=useDispatch();
  const {user}=useSelector((state)=> state.users);
  const [menu,setMenu] = useState([]);
  const [collapsed,setCollapsed] = useState();

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
        return false;
      }
  }
  const getExamsData= async ()=>{
    try {
      dispatch(ShowLoading());
      const response= await getAllExams();
      dispatch(HideLoading());
     if(response.success){
      setExams(response.data);
     }else{
      message.error(response.message);
     }
    
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }
  React.useEffect(()=>{
    getExamsData();
  },[]);
  const deleteExam=async (examId)=>{
    try{
          dispatch(ShowLoading());
          const response=await deleteExamById({
            examId
          });
          dispatch(HideLoading());
          if(response.success){
            message.success(response.message);
            getExamsData();
          }else{
            message.error(response.message)
          }
    }catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }
  const columns = [
    {
      title: 'Exam Name',
      dataIndex: "name"
    },
    {
      title:'Duration',
      dataIndex: "duration",
      className:"Colhide"
    },
    {
      title:'Category',
      dataIndex: "category",
    },
    {
      title:'Total Marks',
      dataIndex: "totalMark",
      className:"Colhide"
    },
    {
      title:'Passing Marks',
      dataIndex: "passingMark",
      className:"Colhide"
    },
    {
      title:'Action',
      dataIndex:"action",
      render:(text,record)=> {
        return (
          <div className='flex gap-2'>
            <i className="ri-pencil-line" 
            onClick={()=>{
              navigate(`/admin/exams/edit/${record._id}`);
            }}
            ></i>
            <i className="ri-delete-bin-line" onClick={()=>{deleteExam(record._id)}}></i>
          </div>
        )
      }
    }
  ]
  


  return (
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
          <h1 className='text-2xl'>Driems polytechnic Quiz Hub</h1>
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
      <div className={`reportContainer p-1 ${collapsed ? `homeHide` : ``}`}> 
      <div className='flex justify-between mt-2 item-end'>
       <PageTitles title="Exam"/>
       <button className='flex item-center primary-outlined-btn'
       onClick={()=>{navigate('/admin/exams/add')}}
       >
        <i className='ri-add-line flex-end'></i>
        Add Exam
       </button>
       </div>
       <div className='divider mt-2'></div>
       <Table columns={columns} dataSource={exams} pagination={{ pageSize:6 }}/>
    </div>
    </div>
  </div>
  )
}

export default Exams;
