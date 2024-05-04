import React, { useEffect, useState } from 'react';
import {Table, message} from 'antd';
import {useDispatch,useSelector} from 'react-redux';
import PageTitles from '../../../component/PageTitles';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import { getAllReportsByUser } from '../../../apiCalls/reports';
import { getUserInfo } from '../../../apiCalls/user';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../../redux/userSlice';


import moment from 'moment';
function UserReports({children}) {
    const [reportsData,setReportsData]=useState([]);
    const dispatch = useDispatch();
    const {user}=useSelector((state)=> state.users);
    const [menu,setMenu] = useState([]);
    const [collapsed,setCollapsed] = useState();
    const navigate=useNavigate();
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


        const getData= async() =>{
          try {
              dispatch(ShowLoading());
               const response = await getAllReportsByUser();
               if(response.success){
                  setReportsData(response.data);
               }else{
                  message.error(response.message);
               }
              dispatch(HideLoading());         
          } catch (error) {
              dispatch(HideLoading());
              message.error(error.message);   
          }
      }
    //         {
    //             title:"Exam Name",
    //             dataIndex: "examName",
    //             render: (text , record)=> <> {record.exam.name}</>    
    //         },
    //         {
    //             title:"Date",
    //             dataIndex: "date",
    //             className:"Colhide",
    //             render: (text , record)=> <> { moment(record.createdAt).format("DD-MM-YYYY hh:mm")}</>
    //         },
    //         {
    //             title:'Total Marks',
    //             dataIndex: "totalMarks",
    //             render: (text , record)=> <> {record.exam.totalMark}</>
    //         },
    //         {
    //             title:'Passing Marks',
    //             dataIndex: "passingMarks",
    //             render: (text , record)=> <> {record.exam.passingMark}</>
    //         },

    //         {
    //             title:"Obtain Mark",
    //             dataIndex: "score",
    //             render: (text , record)=> <> {record.result.correctAnswers.length}</>
    //         },
    //         {
    //             title:"Verdict",
    //             dataIndex: "verdict",
    //             className:"Colhide",
    //             render: (text , record)=> <> {record.result.verdict}</>
    //         }
    // ];
    const columns = [
      {
        title: "Exam Name",
        dataIndex: "exam",
        render: (text, record) => <> {record.exam ? record.exam.name : 'N/A'}</>
      },
      {
        title: "Date",
        dataIndex: "createdAt",
        className: "Colhide",
        render: (text, record) => <> {moment(record.createdAt).format("DD-MM-YYYY hh:mm")}</>
      },
      {
        title: 'Total Marks',
        dataIndex: "exam",
        render: (text, record) => <> {record.exam ? record.exam.totalMark : 'N/A'}</>
      },
      {
        title: 'Passing Marks',
        dataIndex: "exam",
        render: (text, record) => <> {record.exam ? record.exam.passingMark : 'N/A'}</>
      },
      {
        title: "Obtain Mark",
        dataIndex: "result",
        render: (text, record) => <> {record.result ? record.result.correctAnswers.length : 'N/A'}</>
      },
      {
        title: "Verdict",
        dataIndex: "result",
        className: "Colhide",
        render: (text, record) => <> {record.result ? record.result.verdict : 'N/A'}</>
      }
    ];
    
  useEffect(()=>{
        getData();
    },
    [])
  return (
    <div>
    <div className='layout'>
      <div className='flex gap-2'>
        <div className='body'>
          <div className='header flex justify-between'>
            {!collapsed && <i  className="ri-menu-line" onClick={() => {
              setCollapsed(true);
            }}></i>}
            {collapsed && <i  className="ri-close-line" onClick={() => {
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
        <div className={`reportContainer ${collapsed ? `homeHide` : ``}`}>
        <div className='mt-2 p-1'>
        <PageTitles title="Reports"/>
        <hr/>
        <Table columns={columns} dataSource={reportsData} pagination={{ pageSize:6 }}></Table>
    </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default UserReports;