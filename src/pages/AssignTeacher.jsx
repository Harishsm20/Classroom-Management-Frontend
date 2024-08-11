import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssignTeacher = () => {
    const [classrooms, setClassrooms] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [selectedClassroom, setSelectedClassroom] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState('');

    useEffect(() => {
        // Fetch classrooms and teachers
        const fetchData = async () => {
            try {
                const classroomsResponse = await axios.get('/api/classrooms');
                setClassrooms(Array.isArray(classroomsResponse.data) ? classroomsResponse.data : []);

                const teachersResponse = await axios.get('/api/users?role=Teacher');
                setTeachers(Array.isArray(teachersResponse.data) ? teachersResponse.data : []);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchData();
    }, []);

    const handleAssignTeacher = async () => {
        try {
            await axios.post('/api/classrooms/assign-teacher', {
                classroomId: selectedClassroom,
                teacherId: selectedTeacher,
            });
            alert('Teacher assigned successfully');
        } catch (error) {
            console.error('Error assigning teacher', error);
            alert('Failed to assign teacher');
        }
    };

    return (
        <div>
            <h2>Assign Teacher to Classroom</h2>
            <div>
                <label htmlFor="classroom">Classroom:</label>
                <select
                    id="classroom"
                    value={selectedClassroom}
                    onChange={(e) => setSelectedClassroom(e.target.value)}
                >
                    <option value="">Select Classroom</option>
                    {classrooms.map((classroom) => (
                        <option key={classroom._id} value={classroom._id}>
                            {classroom.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="teacher">Teacher:</label>
                <select
                    id="teacher"
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                >
                    <option value="">Select Teacher</option>
                    {teachers.map((teacher) => (
                        <option key={teacher._id} value={teacher._id}>
                            {teacher.name}
                        </option>
                    ))}
                </select>
            </div>
            <button onClick={handleAssignTeacher}>Assign Teacher</button>
        </div>
    );
};

export default AssignTeacher;
