const { default: axiosInstance } = require(".");
export const addReport =async (payload)=>{
try {
    const response=await axiosInstance.post("/api/reports/add-reports",payload);
    return response.data;
} catch (error) {
    return error.response.data;
}
}
export const getAllReports = async (filters)=>{
try {
    const response=await axiosInstance.post("/api/reports/get-all-reports",filters);
    
    return response.data;
} catch (error) {
    return error.response.data;   
}
}
export const getAllReportsByUser = async ()=>{
    try {
        const response=await axiosInstance.post("/api/reports/get-all-reports-by-user");
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

