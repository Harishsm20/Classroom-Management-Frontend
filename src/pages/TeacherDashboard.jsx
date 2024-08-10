import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageHeader from './PageHeader';

const TeacherDashboard = () => {
    const [students, setStudents] = useState([]);
    const [timetable, setTimetable] = useState([]);
    const [newPeriod, setNewPeriod] = useState({ subject: '', startTime: '', endTime: '', day: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch students and timetable for the teacher's classroom
                const [studentsRes, timetableRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/users?role=Student'),
                    axios.get('http://localhost:5000/api/timetable') // Adjust endpoint as needed
                ]);
                setStudents(studentsRes.data);
                setTimetable(timetableRes.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const handleAddPeriod = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/timetable', newPeriod);
            setNewPeriod({ subject: '', startTime: '', endTime: '', day: '' });
            // Reload timetable data
            const timetableRes = await axios.get('http://localhost:5000/api/timetable');
            setTimetable(timetableRes.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <PageHeader title="Teacher Dashboard" />

            <h2>Teacher Dashboard</h2>

            <h3>Students</h3>
            <ul>
                {students.map(student => (
                    <li key={student._id}>{student.name}</li>
                ))}
            </ul>

            <h3>Add Timetable Period</h3>
            <form onSubmit={handleAddPeriod}>
                <input
                    type="text"
                    placeholder="Subject"
                    value={newPeriod.subject}
                    onChange={(e) => setNewPeriod({ ...newPeriod, subject: e.target.value })}
                    required
                />
                <input
                    type="time"
                    placeholder="Start Time"
                    value={newPeriod.startTime}
                    onChange={(e) => setNewPeriod({ ...newPeriod, startTime: e.target.value })}
                    required
                />
                <input
                    type="time"
                    placeholder="End Time"
                    value={newPeriod.endTime}
                    onChange={(e) => setNewPeriod({ ...newPeriod, endTime: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Day (e.g., Monday)"
                    value={newPeriod.day}
                    onChange={(e) => setNewPeriod({ ...newPeriod, day: e.target.value })}
                    required
                />
                <button type="submit">Add Period</button>
            </form>

            <h3>Timetable</h3>
            <ul>
                {timetable.map(period => (
                    <li key={period._id}>{`${period.subject} - ${period.startTime} to ${period.endTime} (${period.day})`}</li>
                ))}
            </ul>
        </div>
    );
};

export default TeacherDashboard;
