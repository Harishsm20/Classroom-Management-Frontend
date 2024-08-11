import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageHeader from './PageHeader';
import { parseJwt } from '../service/jwtService';

const TeacherDashboard = () => {
    const [students, setStudents] = useState([]);
    const [newPeriod, setNewPeriod] = useState({
        subject: '',
        startTime: '',
        endTime: '',
        day: ''
    });
    const [assignedClassroom, setAssignedClassroom] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const decodedToken = parseJwt(token);
                const userId = decodedToken.user.id;

                // Fetch classroom details by teacher ID
                const classroomRes = await axios.get(`http://localhost:5000/api/classrooms/teacher/${userId}`, {
                    headers: { 'x-auth-token': token }
                });

                if (!classroomRes.data) {
                    throw new Error('Classroom not found for this teacher');
                }

                console.log(classroomRes)
                setAssignedClassroom(classroomRes.data);
                setStudents(classroomRes.data.students); // Directly set students from classroom details

            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Failed to fetch data. Check the console for details.');
            }
        };

        fetchData();
    }, []);

    const handlePeriodChange = (e) => {
        setNewPeriod({ ...newPeriod, [e.target.name]: e.target.value });
    };

    const handlePeriodSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            console.log(newPeriod, assignedClassroom._id)
            if (!assignedClassroom) {
                alert('No classroom assigned to this teacher.');
                return;
            }

            await axios.post('http://localhost:5000/api/timetables/create-timetable', 
            { ...newPeriod, classroomId: assignedClassroom._id }, {
                headers: { 'x-auth-token': token }
            });
    
            setNewPeriod({ subject: '', startTime: '', endTime: '', day: '' });
    
            alert('Period created successfully!');
        } catch (error) {
            console.error('Error creating period:', error);
            alert('Failed to create period. Check the console for details.');
        }
    };

    return (
        <div>
            <PageHeader title="Teacher Dashboard" />

            <h2>Teacher Dashboard</h2>

            {/* Students Table */}
            <h3>Students in Your Classroom</h3>
            {assignedClassroom ? (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student._id}>
                                <td>{student.name}</td>
                                <td>{student.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No classroom assigned to this teacher.</p>
            )}

            {/* Create Timetable Period */}
            <h3>Create Timetable Period</h3>
            <form onSubmit={handlePeriodSubmit}>
                <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={newPeriod.subject}
                    onChange={handlePeriodChange}
                    required
                />
                <input
                    type="time"
                    name="startTime"
                    placeholder="Start Time"
                    value={newPeriod.startTime}
                    onChange={handlePeriodChange}
                    required
                />
                <input
                    type="time"
                    name="endTime"
                    placeholder="End Time"
                    value={newPeriod.endTime}
                    onChange={handlePeriodChange}
                    required
                />
                <input
                    type="text"
                    name="day"
                    placeholder="Day"
                    value={newPeriod.day}
                    onChange={handlePeriodChange}
                    required
                />
                <button type="submit">Create Period</button>
            </form>
        </div>
    );
};

export default TeacherDashboard;
