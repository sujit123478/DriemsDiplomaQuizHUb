import React, { useEffect, useState } from 'react';
import PageTitles from '../../../component/PageTitles'
import { addExam, deleteQuestionById, editExamById, getExamById } from '../../../apiCalls/exams';
import { message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch ,useSelector} from 'react-redux';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import { getUserInfo } from '../../../apiCalls/user';
import { setUser } from '../../../redux/userSlice';
import { Form, Row, Col, Select, Input, Button, Tabs, Table } from 'antd';
// import TabPane from 'antd/es/tabs/TabPane';
import AddEditQuestions from './AddEditQuestions';
function AddEditExams({children}) {
  const { Option } = Select;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [showAddEditQuestionModal, setShowAddEditQuestionModal] = useState(false);
  const [selectedQuestion,setSelectedQuestion] = useState(null);
  const [examData, setExamData] = useState();
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
  
  
  
  
  
  const onSubmit = async (value) => {
    try {
      dispatch(ShowLoading());
      let response;
      if (params.id) {
        response = await editExamById({ ...value, examId: params.id });
      } else {
        response = await addExam(value);
      }
      if (response.success) {
        message.success(response.message);
        navigate("/admin/exams");
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };
  const getExamData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getExamById({
        examId: params.id
      });
      dispatch(HideLoading());
      if (response.success) {
        setExamData(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }
  const deleteQuestion = async (questionId) => {
    try {
      dispatch(ShowLoading());
      
      const response = await deleteQuestionById({
        questionId,
        examId: params.id
      });
      console.log(response);
      dispatch(HideLoading());
      
      if(response.success){
        message.success(response.message);
        // Update the state to remove the deleted question
        setExamData(prevExamData => {
          const updatedQuestions = prevExamData.questions.filter(question => question._id !== questionId);
          return {
            ...prevExamData,
            questions: updatedQuestions
          };
        });
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };
  

  useEffect(() => {
    if (params.id) {
      getExamData();
    }
  }, [])
  const questionColumns = [
    {
      title: 'Question',
      dataIndex: 'name',
    },
    {
        title:"Options",
        dataIndex:"options",
        className: 'Colhide',
        render: (text,record) => {
         return Object.keys(record.options).map((key)=>{ 
         return <div>{key}:{record.options[key]}</div>
          });
        }
    },
    {
      title: 'Correct Option',
      dataIndex: 'correctOption',
      render: (text,record) => {    
        return record.options[record.correctOption];
      }
    },
    {
      title: "Action",
      dataIndex: 'action',
      render: (text, record) => {
        return (
          <div className='flex gap-2'>
            <i className="ri-pencil-line"
              onClick={() => {
                setSelectedQuestion(record);
                 setShowAddEditQuestionModal(true);
              }}
            ></i>
            <i className="ri-delete-bin-line" onClick={() => {
             deleteQuestion( record._id)
             }}></i>
          </div>
        )
      }
    }
  ]
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
        <div className={`reportContainer p-1 ${collapsed ? 'homeHide' : ''}`}>
      <PageTitles title={params.id ? 'Edit Exam' : 'Add Exam'}></PageTitles>
      <div className='divider'></div>
      {(examData || !params.id) && (
        <Form layout='vertical' onFinish={onSubmit} initialValues={examData}>
          <Tabs defaultActiveKey='1'>
            <Tabs.TabPane tab='Exam Details' key='1'>
              <Row gutter={[10, 10]}>
                <Col xs={24} sm={24} md={12} lg={8}>
                  <Form.Item label='Exam Name' name='name'>
                    <Input type='text' className='responsive-input' />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={8}>
                  <Form.Item label='Exam Duration' name='duration'>
                    <Input type='number' className='responsive-input' />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={8}>
                  <Form.Item label='Category' name='category'>
                    <Select className='responsive-input'>
                      <Option value=''>Select Category</Option>
                      <Option value='CSE'>CSE</Option>
                      <Option value='ME'>ME</Option>
                      <Option value='ETC'>ETC</Option>
                      <Option value='EE'>EE</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={8}>
                  <Form.Item label='Total Marks' name='totalMark'>
                    <Input type='number' className='responsive-input' />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={8}>
                  <Form.Item label='Passing Marks' name='passingMark'>
                    <Input type='number' className='responsive-input' />
                  </Form.Item>
                </Col>
              </Row>
              <div className='flex justify-end gap-2'>
                <Button
                  type='primary'
                  className='primary-outlined-btn'
                  onClick={() => {
                    navigate('/admin/exams');
                  }}
                >
                  Cancel
                </Button>
                <Button type='primary' htmlType='submit' className='primary-contend-btn'>
                  Save
                </Button>
              </div>
            </Tabs.TabPane>
            {params.id && (
              <Tabs.TabPane tab='Questions' key='2'>
                <h1>Questions</h1>
                <div className='flex justify-end'>
                  <Button
                    className='primary-outlined-btn'
                    type='button'
                    onClick={() => {
                      setShowAddEditQuestionModal(true);
                    }}
                  >
                    Add Question
                  </Button>
                </div>

                <Table columns={questionColumns} dataSource={examData?.questions || []} />
              </Tabs.TabPane>
            )}
          </Tabs>
        </Form>
      )}
      {showAddEditQuestionModal && (
        <AddEditQuestions
          setShowAddEditQuestionModal={setShowAddEditQuestionModal}
          showAddEditQuestionModal={showAddEditQuestionModal}
          examId={params.id}
          refreshData={getExamData}
          selectedQuestion={selectedQuestion}
          setSelectedQuestion={setSelectedQuestion}
        />
      )}
    </div>
      </div>
    </div>
  </div>
  )
}

export default AddEditExams