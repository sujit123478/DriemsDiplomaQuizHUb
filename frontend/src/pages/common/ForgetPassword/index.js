import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, message } from 'antd';
import driemsIMage from "../../../assets/driems.png";
import { changePassword, sendOtp } from '../../../apiCalls/user';
import {useDispatch} from 'react-redux';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';

function ForgetPassword() {
    const [submittedEmail, setSubmittedEmail] = useState(false);
    const [verifiedOTP, setVerifiedOTP] = useState(false);
    const [otpValue, setOtpValue] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [expectedOTP, setExpectedOTP] = useState('');
    const navigate =useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        // Generate OTP when component mounts
        setExpectedOTP(generateOTP());
    }, []);

    const generateOTP = () => {
        const length = 4;
        const characters = '0123456789';
        let OTP = '';
        for (let i = 0; i < length; i++) {
            const index = Math.floor(Math.random() * characters.length);
            OTP += characters[index];
        }
        return OTP;
    };

    const onFinish = async (values) => {
        try {
            if (!submittedEmail) {
                dispatch(ShowLoading());
                setEmail(values.email);
                // Send email and expectedOTP to the server for verification
                const response = await sendOtp({ expectedOTP, email });
                if (response.success) {
                    message.success(response.message);
                    setSubmittedEmail(true);
                    dispatch(HideLoading());
                }else{
                    dispatch(HideLoading());
                    message.error(response.message);
                }
            } else if (!verifiedOTP) {
                console.log(otpValue,expectedOTP);
                if (otpValue.trim() === expectedOTP) {
                    message.success('OTP verified successfully');
                    setVerifiedOTP(true);
                } else {
                    message.error('Incorrect OTP. Please try again.');
                }
                if (otpValue.length !== 4) {
                    message.error('Enter 4 Digit otp');
                }
            } else {
                setPassword(values.password);
                if(password === values.confirmPassword){
                         dispatch(ShowLoading());
                         const response = await changePassword({email,password});
                         if (response.success) {
                            message.success(response.message);
                            navigate('/login');
                            dispatch(HideLoading());
                         }else{
                         dispatch(HideLoading());
                         }
                }  
            }
        } catch (e) {
            dispatch(HideLoading());
            message.error('An unexpected error occurred. Please try again.');
        }
    };

    const handleOtpChange = (index, value) => {
        try {
            setOtpValue((prevOtpValue) => {
                const newOtpValue = prevOtpValue.slice(0, index) + value + prevOtpValue.slice(index + 1);
                return newOtpValue;
            });
        } catch (error) {
            message.error('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div>
            <div className='h-screen flex item-center justify-center bg-primary fixed-position w-100'>
                <div className='card p-3 bg-white forget-card w-400 fixed-position'>
                    <div className='flex flex-col'>
                        <div className='flex item-center justify-center'>
                            <img src={driemsIMage} alt='Driems Logo' width='150px' height='150px' />
                        </div>
                        <h1>{verifiedOTP ? 'Change Password' : submittedEmail ? 'Verify OTP' : 'Forget Password'}</h1>
                        <div className='divider mt-1'></div>
                        <Form layout='vertical' onFinish={onFinish}>
                            <Form.Item name='email' label='Email' className='mt-2' hidden={submittedEmail || verifiedOTP}>
                                <input type='email' />
                            </Form.Item>
                            <Form.Item name='otp' label='OTP' className='mt-2' hidden={!submittedEmail || verifiedOTP}>
                                <div className='otp-input-container'>
                                    {[0, 1, 2, 3].map((index) => (
                                        <input
                                            key={index}
                                            type='text'
                                            maxLength={1}
                                            className='otp-input'
                                            value={otpValue[index] || ''}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                        />
                                    ))}
                                </div>
                            </Form.Item>
                            <Form.Item name='password' label='New Password' className='mt-2' hidden={!verifiedOTP}>
                                <input type='password' />
                            </Form.Item>
                            <Form.Item name='confirmPassword' label='Confirm Password' className='mt-2' hidden={!verifiedOTP}>
                                <input type='password' />
                            </Form.Item>
                            <div className='flex flex-col gap-2'>
                                <button type='submit' className={`primary-contend-btn mt-2 w-100 w-20p`}>
                                    {verifiedOTP ? 'Change Password' : submittedEmail ? 'Verify OTP' : 'Send OTP'}
                                </button>
                                <Link to='/register' className='c-white'>Not a member? Register</Link>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgetPassword;
