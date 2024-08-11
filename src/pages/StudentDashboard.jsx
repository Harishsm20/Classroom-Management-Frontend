import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageHeader from './PageHeader';
import {parseJwt} from '../service/jwtService'; 

const StudentDashboard = () => {
    const [classroom, setClassroom] = useState(null);
    const [timetable, setTimetable] = useState([]);

    useEffect(() => {
        const fetchClassroom = async () => {
            try {
                const token = localStorage.getItem('token');
                const decodedToken = parseJwt(token)
                const userId = decodedToken.user.id;
                
                const classroomRes = await axios.get(`http://localhost:5000/api/classrooms/student/${userId}/`, {
                    headers: { 'x-auth-token': token }
                });
                console.log(classroomRes)

                setClassroom(classroomRes.data);

                // Fetch the timetable for the classroom
                const timetableRes = await axios.get(`http://localhost:5000/api/timetables/classroom/${classroomRes.data._id}`, {
                    headers: { 'x-auth-token': token }
                });

                console.log(`Time tables:`, timetableRes)
                setTimetable(timetableRes.data);
            } catch (error) {
                console.error('Error fetching classroom:', error);
            }
        };

        fetchClassroom();
    }, []);

    return (
        <div>
            <PageHeader title="Student Dashboard" />

            {classroom && (
                <div>
                    <h2>{classroom.name}</h2>
                </div>
            )}

            <h3>Timetable</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Day</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Subject</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Start Time</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>End Time</th>
                    </tr>
                </thead>
                <tbody>
                    {timetable.length > 0 ? (
                        timetable.map(period => (
                            <tr key={period._id}>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{period.day}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{period.subject}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{period.startTime}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{period.endTime}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center', padding: '8px' }}>No timetable available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default StudentDashboard;
