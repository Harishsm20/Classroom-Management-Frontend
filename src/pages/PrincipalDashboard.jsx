import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageHeader from './PageHeader';
import { Link } from 'react-router-dom';

const PrincipalDashboard = () => {
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: '', classroom: '' });
    const [newClassroom, setNewClassroom] = useState({ name: '', startTime: '', endTime: '', teacher: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [teachersRes, studentsRes, classroomsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/users?role=Teacher', { headers: { 'x-auth-token': token } }),
                    axios.get('http://localhost:5000/api/users?role=Student', { headers: { 'x-auth-token': token } }),
                    axios.get('http://localhost:5000/api/classrooms', { headers: { 'x-auth-token': token } })
                ]);
        
                setTeachers(teachersRes.data);
                setStudents(studentsRes.data);
                setClassrooms(classroomsRes.data);
        
                // Filter out teachers already assigned to a classroom
                const assignedTeacherIds = classroomsRes.data.map(c => c.teacher);
                setTeachers(teachersRes.data.filter(teacher => !assignedTeacherIds.includes(teacher._id)));
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Failed to fetch data. Check the console for details.');
            }
        };

        fetchData();
    }, []);

    const handleUserChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const handleClassroomChange = (e) => {
        setNewClassroom({ ...newClassroom, [e.target.name]: e.target.value });
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const userPayload = { ...newUser };
            if (newUser.role !== 'Student') delete userPayload.classroom;

            await axios.post('http://localhost:5000/api/users/create', userPayload, {
                headers: { 'x-auth-token': token }
            });

            setNewUser({ name: '', email: '', password: '', role: '', classroom: '' });
            alert('User created successfully!');

            // Refetch data to update the lists
            const [teachersRes, studentsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/users?role=Teacher', { headers: { 'x-auth-token': token } }),
                axios.get('http://localhost:5000/api/users?role=Student', { headers: { 'x-auth-token': token } })
            ]);
            setTeachers(teachersRes.data);
            setStudents(studentsRes.data);
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const handleClassroomSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/classrooms', newClassroom, {
                headers: { 'x-auth-token': token }
            });
    
            setNewClassroom({ name: '', startTime: '', endTime: '', teacher: '' });
    
            // Refetch classrooms to update the list
            const classroomsRes = await axios.get('http://localhost:5000/api/classrooms', {
                headers: { 'x-auth-token': token }
            });
            setClassrooms(classroomsRes.data);
    
            // Refetch teachers and filter out those already assigned
            const teachersRes = await axios.get('http://localhost:5000/api/users?role=Teacher', {
                headers: { 'x-auth-token': token }
            });
            const assignedTeacherIds = classroomsRes.data.map(c => c.teacher);
            setTeachers(teachersRes.data.filter(teacher => !assignedTeacherIds.includes(teacher._id)));
        } catch (error) {
            console.error(error);
        }
    };
    

    return (
        <div>
            <PageHeader title="Principal Dashboard" />

            <h2>Principal Dashboard</h2>
            <h4><Link to="/assign-teacher">Assign Teacher</Link></h4>
            <h4><Link to="/assign-student">Assign Student</Link></h4>

            {/* Teachers Table */}
            <h3>Teachers</h3>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {teachers.map(teacher => (
                        <tr key={teacher._id}>
                            <td>{teacher.name}</td>
                            <td>{teacher.email}</td>
                            <td>{teacher.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Students Table */}
            <h3>Students</h3>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Classroom</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student._id}>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>{student.classroom}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Create Classroom Form */}
            <h3>Create Classroom</h3>
            <form onSubmit={handleClassroomSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Classroom Name"
                    value={newClassroom.name}
                    onChange={handleClassroomChange}
                    required
                />
                <input
                    type="time"
                    name="startTime"
                    placeholder="Start Time"
                    value={newClassroom.startTime}
                    onChange={handleClassroomChange}
                    required
                />
                <input
                    type="time"
                    name="endTime"
                    placeholder="End Time"
                    value={newClassroom.endTime}
                    onChange={handleClassroomChange}
                    required
                />
                <select
                    name="teacher"
                    value={newClassroom.teacher}
                    onChange={handleClassroomChange}
                    required
                >
                    <option value="">Select Teacher</option>
                    {teachers.map(teacher => (
                        <option key={teacher._id} value={teacher._id}>{teacher.name}</option>
                    ))}
                </select>
                <button type="submit">Create Classroom</button>
            </form>

            {/* Classrooms List */}
            <h3>Classrooms</h3>
            <ul>
                {classrooms.map(classroom => (
                    <li key={classroom._id}>{classroom.name}</li>
                ))}
            </ul>

            {/* Create User Form */}
            <h3>Create a New User</h3>
            <form onSubmit={handleUserSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={newUser.name}
                    onChange={handleUserChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={handleUserChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={handleUserChange}
                    required
                />
                <select
                    name="role"
                    value={newUser.role}
                    onChange={handleUserChange}
                    required
                >
                    <option value="">Select Role</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Student">Student</option>
                </select>
                {newUser.role === 'Student' && (
                    <input
                        type="text"
                        name="classroom"
                        placeholder="Classroom (e.g., 12-B)"
                        value={newUser.classroom}
                        onChange={handleUserChange}
                        required
                    />
                )}
                <button type="submit">Create User</button>
            </form>
        </div>
    );
};

export default PrincipalDashboard;
