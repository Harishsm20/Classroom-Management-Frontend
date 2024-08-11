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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const { user } = parseJwt(token);
                
                const classroomRes = await axios.get(`http://localhost:5000/api/classrooms/${user.classroom}`, {
                    headers: { 'x-auth-token': token }
                });
                setAssignedClassroom(classroomRes.data);

                const studentsRes = await axios.get(`http://localhost:5000/api/users?classroom=${user.classroom}`, {
                    headers: { 'x-auth-token': token }
                });
                setStudents(studentsRes.data);

                const timetableRes = await axios.get(`http://localhost:5000/api/timetables?classroom=${user.classroom}`, {
                    headers: { 'x-auth-token': token }
                });
                setTimetable(timetableRes.data);

                const teachersRes = await axios.get('http://localhost:5000/api/users?role=Teacher', {
                    headers: { 'x-auth-token': token }
                });
                setTeachers(teachersRes.data);
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
            await axios.post('http://localhost:5000/api/timetables', newPeriod, {
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

    return (
        <div>
            <PageHeader title="Teacher Dashboard" />

            <h2>Teacher Dashboard</h2>

            {/* Students Table */}
            <h3>Students in Your Classroom</h3>
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

            {/* Timetable */}
            <h3>Your Timetable</h3>
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
