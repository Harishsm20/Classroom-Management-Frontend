import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentDashboard = () => {
    const [classroom, setClassroom] = useState(null);
    const [timetable, setTimetable] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch classroom and timetable data
                const [classroomRes, timetableRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/classroom'), // Adjust endpoint as needed
                    axios.get('http://localhost:5000/api/timetable') // Adjust endpoint as needed
                ]);
                setClassroom(classroomRes.data);
                setTimetable(timetableRes.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h2>Student Dashboard</h2>

            {classroom && (
                <div>
                    <h3>Classroom</h3>
                    <p>{classroom.name}</p>
                </div>
            )}

            <h3>Timetable</h3>
            <ul>
                {timetable.map(period => (
                    <li key={period._id}>{`${period.subject} - ${period.startTime} to ${period.endTime} (${period.day})`}</li>
                ))}
            </ul>
        </div>
    );
};

export default StudentDashboard;
