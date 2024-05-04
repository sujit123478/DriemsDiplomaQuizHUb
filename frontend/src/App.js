import './stylesheet/theme.css';
import './stylesheet/alignment.css';
import Login from './pages/common/Login/index.js';
import Register from './pages/common/Register';
import './stylesheet/Form-element.css';
import './stylesheet/textelement.css';
import './stylesheet/custom-components.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/common/Home/index.js";
import './stylesheet/layout.css';
import Exams from './pages/admin/Exams/index.js';
import AddEditExam from './pages/admin/Exams/AddEditExams.js';
import Loader from './component/Loader.js';
import WriteExam from './pages/user/WriteExam/index.js';
import { useSelector } from 'react-redux';
import UserReports from '../src/pages/user/userReports/index.js'
import AdminReports from './pages/admin/AdminReports';
import "./stylesheet/responsiveDesign/login-register.css";
import ForgetPassword from './pages/common/ForgetPassword';
import DownloadReports from './pages/admin/DownloadReports/index.js';
function App() {
  const { loading } = useSelector(state => state.loader);

  return (
    <>
      {loading && <Loader />}
      <BrowserRouter>
        <Routes>
          {/* common routes */}
          <Route path='/login' element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path='/forget' element={<ForgetPassword/>}/>
          {/* user routes */}
          <Route path="/" element={
              <Home />
          } />
          <Route path="/user/write-exam/:id" element={
              <WriteExam />
          } />
          {/* admin routes */}
          <Route path="/admin/exams" element={
              <Exams />
          } />
          <Route path="/admin/exams/add" element={
              <AddEditExam />
          } />

          <Route path="/admin/exams/edit/:id" element={
              <AddEditExam />
          } />
          <Route path="/user/reports" element={
              <UserReports />
          } />
          <Route path="/admin/reports" element={
              <AdminReports />
          } />
          <Route path="/admin/downloadReports" element={
              <DownloadReports />
          } />
        </Routes>
      </BrowserRouter>
    </>

  );
}

export default App;
