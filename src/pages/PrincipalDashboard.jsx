import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageHeader from './PageHeader';

const PrincipalDashboard = () => {
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [newClassroom, setNewClassroom] = useState({ name: '', startTime: '', endTime: '', days: '' });

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

    const handleCreateClassroom = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            
            await axios.post('http://localhost:5000/api/classrooms', newClassroom, {
                headers: { 'x-auth-token': token }
            });
            
            setNewClassroom({ name: '', startTime: '', endTime: '', days: '' });
            
            // Reload classrooms data
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

            <h3>Teachers</h3>
            <ul>
                {teachers.map(teacher => (
                    <li key={teacher._id}>{teacher.name}</li>
                ))}
            </ul>

            <h3>Students</h3>
            <ul>
                {students.map(student => (
                    <li key={student._id}>{student.name}</li>
                ))}
            </ul>

            <h3>Create Classroom</h3>
            <form onSubmit={handleCreateClassroom}>
                <input
                    type="text"
                    placeholder="Classroom Name"
                    value={newClassroom.name}
                    onChange={(e) => setNewClassroom({ ...newClassroom, name: e.target.value })}
                    required
                />
                <input
                    type="time"
                    placeholder="Start Time"
                    value={newClassroom.startTime}
                    onChange={(e) => setNewClassroom({ ...newClassroom, startTime: e.target.value })}
                    required
                />
                <input
                    type="time"
                    placeholder="End Time"
                    value={newClassroom.endTime}
                    onChange={(e) => setNewClassroom({ ...newClassroom, endTime: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Days (e.g., Monday, Tuesday)"
                    value={newClassroom.days}
                    onChange={(e) => setNewClassroom({ ...newClassroom, days: e.target.value })}
                    required
                />
                <button type="submit">Create Classroom</button>
            </form>

            <h3>Classrooms</h3>
            <ul>
                {classrooms.map(classroom => (
                    <li key={classroom._id}>{classroom.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default PrincipalDashboard;
