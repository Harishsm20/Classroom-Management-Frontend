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
    const [timetable, setTimetable] = useState([]);

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
                setStudents(classroomRes.data.students); // Directly set students from classroom details

                // Fetch timetable for the classroom
                const timetableRes = await axios.get(`http://localhost:5000/api/timetables/classroom/${classroomRes.data._id}`, {
                    headers: { 'x-auth-token': token }
                });

                setTimetable(timetableRes.data);

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

            {/* Classroom Name */}
            <h2 className="text-2xl font-semibold mb-4">{assignedClassroom ? assignedClassroom.name : 'Loading...'}</h2>

            {/* Students Table */}
            <h3 className="text-xl font-semibold mb-2">Students in Your Classroom</h3>
            {assignedClassroom ? (
                <table className="w-full border-collapse mb-4">
                    <thead>
                        <tr>
                            <th className="border p-2">Name</th>
                            <th className="border p-2">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student._id}>
                                <td className="border p-2">{student.name}</td>
                                <td className="border p-2">{student.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No classroom assigned to this teacher.</p>
            )}

            {/* Timetable */}
            <h3 className="text-xl font-semibold mb-2">Timetable</h3>
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="border p-2">Day</th>
                        <th className="border p-2">Subject</th>
                        <th className="border p-2">Start Time</th>
                        <th className="border p-2">End Time</th>
                    </tr>
                </thead>
                <tbody>
                    {timetable.length > 0 ? (
                        timetable.map(period => (
                            <tr key={period._id}>
                                <td className="border p-2">{period.day}</td>
                                <td className="border p-2">{period.subject}</td>
                                <td className="border p-2">{period.startTime}</td>
                                <td className="border p-2">{period.endTime}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center border p-2">No timetable available</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Create Timetable Period */}
            <h3 className="text-xl font-semibold mb-2">Create Timetable Period</h3>
            <form onSubmit={handlePeriodSubmit} className="mb-4">
                <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={newPeriod.subject}
                    onChange={handlePeriodChange}
                    required
                    className="border p-2 mb-2 w-full"
                />
                <input
                    type="time"
                    name="startTime"
                    placeholder="Start Time"
                    value={newPeriod.startTime}
                    onChange={handlePeriodChange}
                    required
                    className="border p-2 mb-2 w-full"
                />
                <input
                    type="time"
                    name="endTime"
                    placeholder="End Time"
                    value={newPeriod.endTime}
                    onChange={handlePeriodChange}
                    required
                    className="border p-2 mb-2 w-full"
                />
                <input
                    type="text"
                    name="day"
                    placeholder="Day"
                    value={newPeriod.day}
                    onChange={handlePeriodChange}
                    required
                    className="border p-2 mb-4 w-full"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">Create Period</button>
            </form>
        </div>
    );
};

export default TeacherDashboard;
