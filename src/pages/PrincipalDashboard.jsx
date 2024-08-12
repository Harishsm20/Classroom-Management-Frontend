import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageHeader from './PageHeader';
import { FaEdit, FaTrash } from 'react-icons/fa';
import '../css/PricipalDashboard.css';

const apiBaseUrl = 'https://classroom-management-backend.onrender.com'  || 'http://localhost:5000';

const PrincipalDashboard = () => {
    const [teachers, setTeachers] = useState([]);
    const [teachersDropDown, setTeachersDropDown] = useState([]);
    const [students, setStudents] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: '', classroom: '' });
    const [newClassroom, setNewClassroom] = useState({ name: '', startTime: '', endTime: '', teacher: '' });
    const [selectedUser, setSelectedUser] = useState(null);
    const [updatedUser, setUpdatedUser] = useState({ name: '', email: '', role: '', classroom: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [teachersRes, studentsRes, classroomsRes] = await Promise.all([
                    axios.get(`${apiBaseUrl}/api/users?role=Teacher`, { headers: { 'x-auth-token': token } }),
                    axios.get(`${apiBaseUrl}/api/users?role=Student`, { headers: { 'x-auth-token': token } }),
                    axios.get(`${apiBaseUrl}/api/classrooms`, { headers: { 'x-auth-token': token } })
                ]);
                
                console.log(studentsRes)
                setTeachers(teachersRes.data);
                setTeachersDropDown(teachersRes.data);
                setStudents(studentsRes.data);
                setClassrooms(classroomsRes.data);
        
                // Filter out teachers already assigned to a classroom
                const assignedTeacherIds = classroomsRes.data.map(c => c.teacher);
                setTeachersDropDown(teachersRes.data.filter(teacher => !assignedTeacherIds.includes(teacher._id)));
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

    const handleUpdateChange = (e) => {
        setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const userPayload = { ...newUser };
            if (newUser.role !== 'Student') delete userPayload.classroom;
            console.log(newUser.classroom)

            await axios.post(`${apiBaseUrl}/api/users/create`, userPayload, {
                headers: { 'x-auth-token': token }
            });

            setNewUser({ name: '', email: '', password: '', role: '', classroom: '' });
            alert('User created successfully!');

            // Refetch data to update the lists
            const [teachersRes, studentsRes] = await Promise.all([
                axios.get(`${apiBaseUrl}/api/users?role=Teacher`, { headers: { 'x-auth-token': token } }),
                axios.get(`${apiBaseUrl}/api/users?role=Student`, { headers: { 'x-auth-token': token } })
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
            await axios.post(`${apiBaseUrl}/api/classrooms`, newClassroom, {
                headers: { 'x-auth-token': token }
            });
    
            setNewClassroom({ name: '', startTime: '', endTime: '', teacher: '' });
    
            // Refetch classrooms to update the list
            const classroomsRes = await axios.get(`${apiBaseUrl}/api/classrooms`, {
                headers: { 'x-auth-token': token }
            });
            setClassrooms(classroomsRes.data);
    
            // Refetch teachers and filter out those already assigned
            const teachersRes = await axios.get(`${apiBaseUrl}/api/users?role=Teacher`, {
                headers: { 'x-auth-token': token }
            });
            const assignedTeacherIds = classroomsRes.data.map(c => c.teacher);
            setTeachers(teachersRes.data.filter(teacher => !assignedTeacherIds.includes(teacher._id)));
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${apiBaseUrl}/api/users/${userId}`, {
                headers: { 'x-auth-token': token }
            });

            // Refetch data to update the lists
            const [teachersRes, studentsRes] = await Promise.all([
                axios.get(`${apiBaseUrl}/api/users?role=Teacher`, { headers: { 'x-auth-token': token } }),
                axios.get(`${apiBaseUrl}/api/users?role=Student`, { headers: { 'x-auth-token': token } })
            ]);
            setTeachers(teachersRes.data);
            setStudents(studentsRes.data);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${apiBaseUrl}/api/users/${selectedUser._id}`, updatedUser, {
                headers: { 'x-auth-token': token }
            });

            setSelectedUser(null);
            setUpdatedUser({ name: '', email: '', role: '', classroom: '' });
            alert('User updated successfully!');

            // Refetch data to update the lists
            const [teachersRes, studentsRes] = await Promise.all([
                axios.get(`${apiBaseUrl}/api/users?role=Teacher`, { headers: { 'x-auth-token': token } }),
                axios.get(`${apiBaseUrl}/api/users?role=Student`, { headers: { 'x-auth-token': token } })
            ]);
            setTeachers(teachersRes.data);
            setStudents(studentsRes.data);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setUpdatedUser({ name: user.name, email: user.email, role: user.role, classroom: user.classroom || '' });
    };

    return (
        <div className="PrincipalDashboard">
            <PageHeader title="Principal Dashboard" />

            <h2>Principal Dashboard</h2>

            {/* Teachers Table */}
            <h3>Teachers</h3>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {teachers.map(teacher => (
                        <tr key={teacher._id}>
                            <td>{teacher.name}</td>
                            <td>{teacher.email}</td>
                            <td>{teacher.role}</td>
                            <td className="actions">
                                <button onClick={() => handleDeleteUser(teacher._id)}>
                                    <FaTrash />
                                </button>
                                <button onClick={() => handleSelectUser(teacher)}>
                                    <FaEdit />
                                </button>
                            </td>
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
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student._id}>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>{student.classroom}</td>
                            <td className="actions">
                                <button onClick={() => handleDeleteUser(student._id)}>
                                    <FaTrash />
                                </button>
                                <button onClick={() => handleSelectUser(student)}>
                                    <FaEdit />
                                </button>
                            </td>
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
                    value={newClassroom.name}
                    onChange={handleClassroomChange}
                    placeholder="Classroom Name"
                    required
                />
                <input
                    type="time"
                    name="startTime"
                    value={newClassroom.startTime}
                    onChange={handleClassroomChange}
                    placeholder="Start Time"
                    required
                />
                <input
                    type="time"
                    name="endTime"
                    value={newClassroom.endTime}
                    onChange={handleClassroomChange}
                    placeholder="End Time"
                    required
                />
                <select
                    name="teacher"
                    value={newClassroom.teacher}
                    onChange={handleClassroomChange}
                    required
                >
                    <option value="">Select Teacher</option>
                    {teachersDropDown.map(teacher => (
                        <option key={teacher._id} value={teacher._id}>{teacher.name}</option>
                    ))}
                </select>
                <button type="submit">Create Classroom</button>
            </form>

            {/* Update User Form */}
            {selectedUser && (
                <div>
                    <h3>Edit User</h3>
                    <form onSubmit={handleUpdateUser}>
                        <input
                            type="text"
                            name="name"
                            value={updatedUser.name}
                            onChange={handleUpdateChange}
                            placeholder="Name"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            value={updatedUser.email}
                            onChange={handleUpdateChange}
                            placeholder="Email"
                            required
                        />
                        <select
                            name="role"
                            value={updatedUser.role}
                            onChange={handleUpdateChange}
                            required
                        >
                            <option value="Teacher">Teacher</option>
                            <option value="Student">Student</option>
                        </select>
                        {updatedUser.role === 'Student' && (
                            <input
                                type="text"
                                name="classroom"
                                value={updatedUser.classroom}
                                onChange={handleUpdateChange}
                                placeholder="Classroom"
                            />
                        )}
                        <button type="submit">Update User</button>
                    </form>
                </div>
            )}

            {/* Create User Form */}
            <h3>Create User</h3>
            <form onSubmit={handleUserSubmit}>
                <input
                    type="text"
                    name="name"
                    value={newUser.name}
                    onChange={handleUserChange}
                    placeholder="Name"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleUserChange}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleUserChange}
                    placeholder="Password"
                    required
                />
                <select
                    name="role"
                    value={newUser.role}
                    onChange={handleUserChange}
                    required
                >
                    <option value="" disabled> Select Role </option> 
                    <option value="Teacher">Teacher</option>
                    <option value="Student">Student</option>
                </select>
                {newUser.role === 'Student' && (
                    <select
                        name="classroom"
                        value={newUser.classroom}
                        onChange={handleUserChange}
                        required
                    >
                        <option value="">Select Classroom</option>
                        {classrooms.map(classroom => (
                            <option key={classroom._id} value={classroom.name}>{classroom.name}</option>
                        ))}
                    </select>
                )}
                <button type="submit">Create User</button>
            </form>
        </div>
    );
};

export default PrincipalDashboard;
