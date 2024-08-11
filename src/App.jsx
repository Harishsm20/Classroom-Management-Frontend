import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import PrincipalDashboard from './pages/PrincipalDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import AssignStudent from './pages/AssignStudents';
import AssignTeacher from './pages/AssignTeacher';
import Signup from './pages/Signup';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/principal-dashboard" element={<PrincipalDashboard />} />
                <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
                <Route path="/student-dashboard" element={<StudentDashboard />} />
                <Route path="/assign-teacher" element={<AssignTeacher />} />
                <Route path="/assign-student" element={<AssignStudent />} />
            </Routes>
        </Router>
    );
}

export default App;
