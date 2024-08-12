import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageHeader from './PageHeader';
import { parseJwt } from '../service/jwtService';

const apiBaseUrl = 'https://classroom-management-backend.onrender.com'  || 'http://localhost:5000';


const StudentDashboard = () => {
    const [classroom, setClassroom] = useState(null);
    const [timetable, setTimetable] = useState([]);

    useEffect(() => {
        const fetchClassroom = async () => {
            try {
                const token = localStorage.getItem('token');
                const decodedToken = parseJwt(token);
                const userId = decodedToken.user.id;
                
                const classroomRes = await axios.get(`${apiBaseUrl}/api/classrooms/student/${userId}/`, {
                    headers: { 'x-auth-token': token }
                });

                setClassroom(classroomRes.data);

                // Fetch the timetable for the classroom
                const timetableRes = await axios.get(`${apiBaseUrl}/api/timetables/classroom/${classroomRes.data._id}`, {
                    headers: { 'x-auth-token': token }
                });

                setTimetable(timetableRes.data);
            } catch (error) {
                console.error('Error fetching classroom:', error);
            }
        };

        fetchClassroom();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <PageHeader title="Student Dashboard" />

            {classroom && (
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold">{classroom.name}</h2>
                </div>
            )}

            <h3 className="text-xl font-medium mb-4">Timetable</h3>
            <div className="overflow-x-auto flex justify-center">
                <table className="w-full max-w-4xl bg-white border border-gray-200 text-center">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="py-2 px-4 border border-gray-300">Day</th>
                            <th className="py-2 px-4 border border-gray-300">Subject</th>
                            <th className="py-2 px-4 border border-gray-300">Start Time</th>
                            <th className="py-2 px-4 border border-gray-300">End Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {timetable.length > 0 ? (
                            timetable.map(period => (
                                <tr key={period._id} className="border-b">
                                    <td className="py-2 px-4 border border-gray-300">{period.day}</td>
                                    <td className="py-2 px-4 border border-gray-300">{period.subject}</td>
                                    <td className="py-2 px-4 border border-gray-300">{period.startTime}</td>
                                    <td className="py-2 px-4 border border-gray-300">{period.endTime}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="py-2 px-4 border border-gray-300 text-center">No timetable available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentDashboard;
