import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssignStudent = () => {
    const [classrooms, setClassrooms] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedClassroom, setSelectedClassroom] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');

    useEffect(() => {
        // Fetch classrooms and students
        const fetchData = async () => {
            try {
                const classroomsResponse = await axios.get('/api/classrooms');
                setClassrooms(Array.isArray(classroomsResponse.data) ? classroomsResponse.data : []);

                const studentsResponse = await axios.get('/api/users?role=Student');
                setStudents(Array.isArray(studentsResponse.data) ? studentsResponse.data : []);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchData();
    }, []);

    const handleAssignStudent = async () => {
        try {
            await axios.post('/api/classrooms/assign-student', {
                classroomId: selectedClassroom,
                studentId: selectedStudent,
            });
            alert('Student assigned successfully');
        } catch (error) {
            console.error('Error assigning student', error);
            alert('Failed to assign student');
        }
    };

    return (
        <div>
            <h2>Assign Student to Classroom</h2>
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
                <label htmlFor="student">Student:</label>
                <select
                    id="student"
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                >
                    <option value="">Select Student</option>
                    {students.map((student) => (
                        <option key={student._id} value={student._id}>
                            {student.name}
                        </option>
                    ))}
                </select>
            </div>
            <button onClick={handleAssignStudent}>Assign Student</button>
        </div>
    );
};

export default AssignStudent;
