import React, { useEffect, useState } from 'react'
import axios from 'axios'

function Results() {
    const [students, setStudents] = useState([])
    const [selectedStudent, setSelectedStudent] = useState('')
    const [result, setResult] = useState({})

    const fetchStudents = async () => {
        try {
            const response = await axios.get('http://localhost:4000/students?result=true')
            setStudents(response.data)
        } catch (error) {
            console.error('Error fetching students:', error)
            alert('Something went wrong while fetching students.')
        }
    }

    const fetchResult = async () => {
        try {
            if (!selectedStudent) return
            const formattedResult = await axios.get(`http://localhost:4000/results/formatted/students/${selectedStudent}`)
            setResult(formattedResult.data)
        } catch (error) {
            console.error('Error fetching result:', error)
            alert('Something went wrong while fetching the result.')
        }
    }

    const handleStudentChange = (event) => {
        setSelectedStudent(event.target.value)
    }

    const handleDelete = async () => {
        try {
            if (!selectedStudent) {
                alert('Please select a student to delete.')
                return
            }
            const confirmDeletion = window.confirm('Are you sure you want to delete this Result?')

            if (confirmDeletion) {
                const deleteResponse = await axios.delete(`http://localhost:4000/results/${result._id}`)

                if (deleteResponse.status === 200) {
                    alert('Student deleted successfully.')
                    fetchStudents()
                    setSelectedStudent('')
                    setResult({})
                } else {
                    alert('Failed to delete the student.')
                }
            }
        } catch (error) {
            console.error('Error deleting student:', error)
            alert('Something went wrong while deleting the student.')
        }
    }

    useEffect(() => {
        fetchStudents()
    }, [])

    useEffect(() => {
        fetchResult()
    }, [selectedStudent])

    return (
        <div className="mt-12 text-5xl text-center">
            <h1>Results</h1>
            <div className="flex text-2xl flex-col w-11/12 mx-auto sm:w-9/12 md:w-8/12 mt-12">
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                        <div className="overflow-hidden">
                            <label htmlFor="students">Choose Result of student:</label><br />
                            <select className='mt-4 text-xl' name="students" id="students" onChange={handleStudentChange} value={selectedStudent}>
                                <option value="" disabled selected>Select an option</option>
                                {students && students.map(student => (
                                    <option key={student._id} value={student._id}>{student.firstName} {student.lastName}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            {selectedStudent && result && Object.keys(result).length > 0 && (
                <>
                    <div className="flex flex-col w-11/12 mx-auto sm:w-9/12 md:w-8/12 mt-10">
                        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                                <div className="overflow-hidden">
                                    <div className="min-w-full text-sm font-light text-center sm:text-lg">
                                        <div className="font-medium border-b">
                                            <div className='flex mx-auto w-full  justify-between'>
                                                <div className="px-6 py-4">#id: {result._id}</div>
                                                <div className="px-6 py-4">Signed By: {result.Signed_By}</div>
                                                <div className="px-6 py-4">Student Name: {result.studentInfo?.firstName}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <table className="min-w-full text-sm font-light text-center sm:text-lg">
                                        <thead className="font-medium border-b">
                                            <tr>
                                                <th scope="col" className="px-6 py-4">sub_code</th>
                                                <th scope="col" className="px-6 py-4">name</th>
                                                <th scope="col" className="px-6 py-4">credits</th>
                                                <th scope="col" className="px-6 py-4">obtained marks</th>
                                                <th scope="col" className="px-6 py-4">Maximum Marks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result?.Marks?.map((data, index) => (
                                                <tr
                                                    key={index}
                                                    className="transition duration-300 ease-in-out border-b hover:bg-gray-200">
                                                    <td className="px-6 py-4 font-medium whitespace-nowrap">{data.sub_code}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{data.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{data.credit}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{data.marks}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{data.maximumMarks}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='mt-16 text-3xl'>
                        <button
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-400 text-white py-2 px-9 rounded focus:outline-none focus:shadow-outline"
                        >
                            Delete
                        </button>
                    </div>
                </>

            )}
        </div>
    )
}

export default Results
