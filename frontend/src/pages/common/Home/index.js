import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import { getAllExams } from '../../../apiCalls/exams';
import { Col, Row, message } from 'antd';
import PageTitles, { PageTitle } from '../../../component/PageTitles';
import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '../../../apiCalls/user';
import { setUser } from '../../../redux/userSlice';
function Home({ children }) {
  const { user } = useSelector((state) => state.users);
  const [exams, setExams] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);
  const [collapsed, setCollapsed] = useState();
  const getExams = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams();
      if (response.success) {
        setExams(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }
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
  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUserData();
    } else {
      navigate('/login');
    }
  }, []);
  useEffect(() => {
    getExams();
  }, []);
  return (
    user &&
     <div>
      <div className='layout'>
        <div className='flex gap-2'>
          <div className='body'>
            <div className='header flex justify-between'>
              {!collapsed && <i className="ri-menu-line"onClick={() => {
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
            <PageTitles title={
              `Hi ${user?.name}`
            } />
            <div className='divider mt-2'></div>
            <Row gutter={[16, 16]}>
              {exams.map((exam) => (
                <Col key={exam._id} span={24} sm={12} md={8} lg={6} xl={6} xxl={6} >
                  <div className="card">
                    <h1>{exam.name}</h1>
                    <hr />
                    <h2 className='m-1'>Category: {exam.category}</h2>
                    <h2 className='m-1'>Total Marks: {exam.totalMark}</h2>
                    <h2 className='m-1'>Passing Marks: {exam.passingMark}</h2>
                    <h2 className='m-1'>Duration: {exam.duration}</h2>
                    <button
                      className="primary-outlined-btn className='m-1'"
                      onClick={() => {
                        navigate(`user/write-exam/${exam._id}`);
                      }}
                    >
                      Start Exam
                    </button>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;
