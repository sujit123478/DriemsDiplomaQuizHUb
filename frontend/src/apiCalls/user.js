const { default: axiosInstance } = require(".");
export const registerUser = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/users/register", payload);
        return response.data;
    } catch (e) {
        return e.response.data;
    }
}
export const loginUser= async (payload) => {
    try{
       const response = await axiosInstance.post("/api/users/login", payload);
       return response.data;
    }catch(error){
         return error.response.data;
    }
}
export const getUserInfo = async (payload) => {
try {
    const response = await axiosInstance.post("/api/users/get-user-info");
    return response.data;
    
} catch (error) {
    return error.response.data;
}
}
export const sendOtp = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/users/send-otp",payload);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
    }
export const changePassword = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/users/change-password",payload);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
    }


