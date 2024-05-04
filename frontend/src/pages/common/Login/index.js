import React from 'react';
import {Form ,message} from 'antd';
import { Link } from 'react-router-dom';
import { loginUser } from '../../../apiCalls/user';
import {useDispatch} from 'react-redux';
import { ShowLoading,HideLoading } from '../../../redux/loaderSlice';
import driemsIMage from "../../../assets/driems.png";
function Login() {
  const dispatch = useDispatch();
  let onFinish= async (value)=>{
     try {
          dispatch(ShowLoading());
          const response = await loginUser(value);
          dispatch(HideLoading());
          if (response.success){
            message.success(response.message);
            localStorage.setItem("token", response.data);
            window.location.href = "/";
          }else{
            message.error(response.message);
          }
     } catch (error) {
      dispatch(HideLoading());
      message.error(error);
     } 
  }
  return (
    <div className='h-screen flex item-center justify-center bg-primary fixed-position w-100 '>
      <div className='card w-400 p-3 bg-white login-card  fixed-position'>
       <div className='flex flex-col'>
       <div className='flex item-center justify-center'>
      <img src={driemsIMage} alt='Driems Logo' width='150px' height="150px"/>
      </div>
      <h1>Login Form</h1>
        <div className='divider mt-1'></div>
        <Form layout='vertical' onFinish={onFinish}>
            <Form.Item name="email" label="Email" className='mt-2 '>
             <input type="email" />
            </Form.Item>
            <Form.Item name="Password" label="Password">
             <input type="password"/>
            </Form.Item>
            <div className='flex flex-col gap-2'>
            <button type='submit' className='primary-contend-btn mt-2 w-100'>Login</button>
            <Link to="/register" className='c-white'>Not a member ? Register</Link>
            <Link to="/forget" className='c-white'>Forget Password</Link>
            </div>
        </Form>
      </div>
      </div>
    </div>
  )
}

export default Login;
