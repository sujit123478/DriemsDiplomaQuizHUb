const { default: axiosInstance } = require(".");
export const addExam = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/exams/add", payload);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};
export const getAllExams = async () => {
    try {
        const response = await axiosInstance.post("/api/exams/get-all-exams");
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
export const getExamById = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/exams/get-exam-by-id", payload);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
//edit exam
export const editExamById = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/exams/edit-exam-by-id", payload);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
//delete exam
export const deleteExamById = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/exams/delete-exam-by-id",payload);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
export const addQuestionToExam = async (payload) => {
try {

 const response = await axiosInstance.post("/api/exams/add-question-to-exam",payload);
 

 return response.data;
} catch (error) {
    return error.response.data;
}
}
export const editQuestionById = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/exams/edit-question-in-exam",payload);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const deleteQuestionById = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/exams/delete-question-in-exam",payload);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}