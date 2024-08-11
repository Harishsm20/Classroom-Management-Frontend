
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageHeader from './PageHeader';
import { parseJwt } from '../service/jwtService';

const TeacherDashboard = () => {
    const [students, setStudents] = useState([]);
    const [timetable, setTimetable] = useState([]);
    const [newPeriod, setNewPeriod] = useState({
        subject: '',
        startTime: '',
        endTime: '',
        day: ''
    });
    const [assignedClassroom, setAssignedClassroom] = useState(null);
    const [teachers, setTeachers] = useState([]);
    const [newSubject, setNewSubject] = useState({
        subject: '',
        teacherId: ''
    });
    const [error, setError] = useState(null);

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
    
                setAssignedClassroom(classroomRes.data);
    
                // Fetch students associated with the classroom
                const studentsRes = await axios.get(`http://localhost:5000/api/classrooms/students?classroom=${classroomRes.data._id}`, {
                    headers: { 'x-auth-token': token }
                });
                setStudents(studentsRes.data);
    
                // Fetch timetable associated with the classroom
                const timetableRes = await axios.get(`http://localhost:5000/api/timetables?classroom=${classroomRes.data._id}`, {
                    headers: { 'x-auth-token': token }
                });
    
                if (timetableRes.status === 404) {
                    alert('No timetable found for this classroom.');
                } else {
                    setTimetable(timetableRes.data);
                }
    
                // Fetch all teachers
                const teachersRes = await axios.get('http://localhost:5000/api/users?role=Teacher', {
                    headers: { 'x-auth-token': token }
                });
                setTeachers(teachersRes.data);
    
            } catch (error) {
                console.error('Error fetching data:', error);
                // setError('Failed to fetch data. Check the console for details.');
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
            await axios.post('http://localhost:5000/api/timetables', 
            { ...newPeriod, classroomId: assignedClassroom._id }, {
                headers: { 'x-auth-token': token }
            });

            setNewPeriod({ subject: '', startTime: '', endTime: '', day: '' });

            const timetableRes = await axios.get(`http://localhost:5000/api/timetables?classroom=${assignedClassroom._id}`, {
                headers: { 'x-auth-token': token }
            });
            setTimetable(timetableRes.data);

            alert('Period created successfully!');
        } catch (error) {
            console.error('Error creating period:', error);
            alert('Failed to create period. Check the console for details.');
        }
    };

    const handleSubjectChange = (e) => {
        setNewSubject({ ...newSubject, [e.target.name]: e.target.value });
    };

    const handleSubjectAssignment = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/timetables/assign-subject', {
                ...newSubject,
                classroomId: assignedClassroom._id
            }, {
                headers: { 'x-auth-token': token }
            });

            setNewSubject({ subject: '', teacherId: '' });

            alert('Subject assigned successfully!');
        } catch (error) {
            console.error('Error assigning subject:', error);
            alert('Failed to assign subject. Check the console for details.');
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

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

            {/* Timetable */}
            <h3>Your Timetable</h3>
            {timetable.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Day</th>
                        </tr>
                    </thead>
                    <tbody>
                        {timetable.map(period => (
                            <tr key={period._id}>
                                <td>{period.subject}</td>
                                <td>{period.startTime}</td>
                                <td>{period.endTime}</td>
                                <td>{period.day}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No timetable available for your classroom.</p>
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

            {/* Subject Assignment */}
            <h3>Assign Subject</h3>
            <form onSubmit={handleSubjectAssignment}>
                <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={newSubject.subject}
                    onChange={handleSubjectChange}
                    required
                />
                <select
                    name="teacherId"
                    value={newSubject.teacherId}
                    onChange={handleSubjectChange}
                    required
                >
                    <option value="">Select Teacher</option>
                    {teachers.map(teacher => (
                        <option key={teacher._id} value={teacher._id}>{teacher.name}</option>
                    ))}
                </select>
                <button type="submit">Assign Subject</button>
            </form>
        </div>
    );
};

export default TeacherDashboard;
