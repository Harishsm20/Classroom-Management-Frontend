import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageHeader from './PageHeader';

const PrincipalDashboard = () => {
    // State for storing teachers, students, and classrooms
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [classrooms, setClassrooms] = useState([]);

    // State for new user creation
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        classroom: ''
    });

    // State for new classroom creation
    const [newClassroom, setNewClassroom] = useState({ 
        name: '', 
        startTime: '', 
        endTime: '', 
        days: '' 
    });

    // Fetch teachers, students, and classrooms data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token'); 
                
                const [teachersRes, studentsRes, classroomsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/users?role=Teacher', {
                        headers: { 'x-auth-token': token }
                    }),
                    axios.get('http://localhost:5000/api/users?role=Student', {
                        headers: { 'x-auth-token': token }
                    }),
                    axios.get('http://localhost:5000/api/classrooms', {
                        headers: { 'x-auth-token': token }
                    })
                ]);
                
                setTeachers(teachersRes.data);
                setStudents(studentsRes.data);
                setClassrooms(classroomsRes.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    // Handle input change for new user form
    const handleUserChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    // Handle input change for new classroom form
    const handleClassroomChange = (e) => {
        setNewClassroom({ ...newClassroom, [e.target.name]: e.target.value });
    };

    // Submit handler for creating a new user
    const handleUserSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/users/create', newUser, {
                headers: { 'x-auth-token': token }
            });
            setNewUser({
                name: '',
                email: '',
                password: '',
                role: '',
                classroom: ''
            });
            alert('User created successfully!');

            // Reload users data after creating a new user
            const [teachersRes, studentsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/users?role=Teacher', {
                    headers: { 'x-auth-token': token }
                }),
                axios.get('http://localhost:5000/api/users?role=Student', {
                    headers: { 'x-auth-token': token }
                })
            ]);
            setTeachers(teachersRes.data);
            setStudents(studentsRes.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Submit handler for creating a new classroom
    const handleClassroomSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/classrooms', newClassroom, {
                headers: { 'x-auth-token': token }
            });
            setNewClassroom({ name: '', startTime: '', endTime: '', days: '' });

            // Reload classrooms data after creating a new classroom
            const classroomsRes = await axios.get('http://localhost:5000/api/classrooms', {
                headers: { 'x-auth-token': token }
            });
            setClassrooms(classroomsRes.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <PageHeader title="Principal Dashboard" />

            <h2>Principal Dashboard</h2>

            {/* Teachers List */}
            <h3>Teachers</h3>
            <ul>
                {teachers.map(teacher => (
                    <li key={teacher._id}>{teacher.name}</li>
                ))}
            </ul>

            {/* Students List */}
            <h3>Students</h3>
            <ul>
                {students.map(student => (
                    <li key={student._id}>{student.name}</li>
                ))}
            </ul>

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
                <input
                    type="text"
                    name="days"
                    placeholder="Days (e.g., Monday, Tuesday)"
                    value={newClassroom.days}
                    onChange={handleClassroomChange}
                    required
                />
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
