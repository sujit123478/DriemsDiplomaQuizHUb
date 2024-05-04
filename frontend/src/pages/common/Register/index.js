import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, message } from 'antd';
import { registerUser } from '../../../apiCalls/user';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import driemsIMage from "../../../assets/driems.png";
function Register() {
  const dispatch =useDispatch();
  const navigate = useNavigate();
  const onFinish =async(values) => {
   try {
       dispatch(ShowLoading());
       const response = await registerUser(values);
       dispatch(HideLoading());
       if(response.success) {
        message.success(response.message);
        navigate("/login");
       }else {
        message.error(response.message);
       }
   } catch (error) {
    dispatch(HideLoading());
    message.error(error);
   }
  };
  return (
    <div className='h-screen flex item-center justify-center bg-primary fixed-position w-100 '>
    <div className='card w-400 p-3 bg-white register-card fixed-position'>
    <div className='flex flex-col'>
    <div className='flex item-center justify-center'>
    <img src={driemsIMage} alt='Driems Logo' width='150px' height="150px" className='logo'/>
    </div>
    <h1>Register Form</h1>
      <div className='divider mt-1'></div>
      <Form layout='vertical' onFinish={onFinish}>
          <Form.Item name="name" label="Name" className='mt-1'>
           <input type="text" />
          </Form.Item>
          <Form.Item name="RegistrationNumber" label="Registration Number"  >
           <input type="text" />
          </Form.Item>
          <Form.Item name="email" label="Email" >
           <input type="email" />
          </Form.Item>
          <Form.Item name="Password" label="Password">
           <input type="password" />
          </Form.Item>
          <div className='flex flex-col gap-1'>
          <button type='submit' className='primary-contend-btn  w-100'>Register</button>
          <Link to="/login" className='c-white'>Already a member ? Login</Link>
          </div>
      </Form>
    </div>
    </div>
  </div>
  )
}

export default Register;
