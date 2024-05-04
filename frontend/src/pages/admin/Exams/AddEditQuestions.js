import { Form, Modal, message } from 'antd'
import React from 'react'
import { addQuestionToExam,  editQuestionById } from '../../../apiCalls/exams';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';

function AddEditQuestions({setShowAddEditQuestionModal,showAddEditQuestionModal,
  examId,refreshData,selectedQuestion,setSelectedQuestion}
  ) {
    const dispatch = useDispatch();
    const onFinish =async (value) => {
    try {
      dispatch(ShowLoading());
      const requirePayload = {
        name: value.name,
        correctOption: value.correctOption,
        options:{
          A: value.A,
          B: value.B,
          C: value.C,
          D: value.D
        },
        exam:examId
      }
      let response 
      if(selectedQuestion){
       response = await editQuestionById({
        ...requirePayload,
        questionId: selectedQuestion._id
       }
       )
      }else{
         response = await addQuestionToExam(requirePayload);
      }
      if(response.success) {
        message.success(response.message);
        refreshData();
        setShowAddEditQuestionModal(false);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
      setSelectedQuestion(null);
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
    };



  
    return (
      <div >
      <Modal
      className='questionContainer'
  title={selectedQuestion ? "Edit Question" : "Add Question"}
  open={showAddEditQuestionModal}
  onCancel={() => {
    setShowAddEditQuestionModal(false);
    setSelectedQuestion(null);
  }}
  footer={false}
>
  <Form
    onFinish={onFinish}
    layout="vertical"
    initialValues={{
      name: selectedQuestion?.name,
      A: selectedQuestion?.options.A,
      B: selectedQuestion?.options.B,
      C: selectedQuestion?.options.C,
      D: selectedQuestion?.options.D,
      correctOption: selectedQuestion?.correctOption,
    }}
  >
    <Form.Item name="name" label="Question">
      <input type="text" className="w-full p-2" />
    </Form.Item>
    <Form.Item name="correctOption" label="Correct Option">
      <input type="text" className="w-full p-2" />
    </Form.Item>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Form.Item name="A" label="Option A">
        <input type="text" className="w-full p-2" />
      </Form.Item>
      <Form.Item name="B" label="Option B">
        <input type="text" className="w-full p-2" />
      </Form.Item>
      <Form.Item name="C" label="Option C">
        <input type="text" className="w-full p-2" />
      </Form.Item>
      <Form.Item name="D" label="Option D">
        <input type="text" className="w-full p-2" />
      </Form.Item>
    </div>
    <div className="flex justify-end gap-2">
      <button className="primary-outlined-btn" type="button">
        Cancel
      </button>
      <button className="primary-contend-btn">Save</button>
    </div>
  </Form>
     </Modal>
     </div>
  )
}

export default AddEditQuestions;