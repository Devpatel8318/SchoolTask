const express = require('express')
const router = new express.Router()
const crypto = require('crypto')
const validId = require('../middleware/validId')
const { log } = require('console')

const passwordEncryption = (password) => {
    const pattern =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/
    if (!pattern.test(password)) return false
    return crypto.createHash('md5').update(password).digest('hex')
}

const routes = (db) => {
    // Get all students
    router.get('/students', async (req, res) => {
        try {
            let filter = {}

            if (req.query.result === 'false') {
                filter = { result: { $exists: false } }
            }
            if (req.query.result === 'true') {
                filter = { result: { $exists: true } }
            }

            const students = await db
                .collection('students')
                .find(filter)
                .project({ password: 0 })
                .toArray()

            return res.status(200).send(students)
        } catch (err) {
            res.status(500).send({ error: err })
        }
    })

    // Get Single student
    router.get('/students/:id', validId, async (req, res) => {
        try {
            const studentDoc = await db
                .collection('students')
                .findOne(
                    { _id: req.params.id },
                    { projection: { password: 0 } }
                )

            if (!studentDoc)
                return res.status(404).json({ error: 'Student not found' })

            return res.status(200).send(studentDoc)
        } catch (err) {
            res.status(500).send({ error: 'Internal server error' })
        }
    })

    //   Student Login
    router.post('/students/login', async (req, res) => {
        const { email, password } = req.body

        if (!password || !email) {
            res.status(400).send({ error: 'Please provide credentails' })
        }

        try {
            const student = await db.collection('students').findOne({ email })

            if (!student)
                return res.status(404).send({ error: 'student not found' })

            if (student.password !== passwordEncryption(password))
                return res.status(401).send({ error: 'Wrong password' })

            delete student.password
            return res.status(200).send(student)
        } catch (err) {
            res.status(500).send({ error: 'Internal server error' })
        }
    })

    // Create a new student
    router.post('/students', async (req, res) => {
        const student = req.body

        if (!student.password)
            return res.status(400).send({ error: 'Please provide a password' })

        const encryptedPassword = passwordEncryption(student.password)

        if (encryptedPassword === false) {
            return res.status(400).send({
                error: 'Password should contain at least one uppercase letter, one special character, and one number',
            })
        } else {
            student.password = encryptedPassword
        }

        try {
            const studentDoc = await db
                .collection('students')
                .insertOne(student)

            if (!studentDoc || !studentDoc.insertedId) {
                return res
                    .status(500)
                    .send({ error: 'Failed to create the student' })
            }

            return res.status(201).send(studentDoc.insertedId)
        } catch (err) {
            if (err.code === 11000) {
                return res.status(409).send({ error: 'Email already exists' })
            }
            return res.status(400).send(err.errInfo)
            // const errors = []
            // err.errInfo.details.schemaRulesNotSatisfied[0].propertiesNotSatisfied.forEach((error) => {
            //     errors.push({ error: error.propertyName, message: error.details });
            // })
            // return res.status(500).send({ error: errors });
        }
    })

    // Update a Student
    router.patch('/students/:id', validId, async (req, res) => {
        const updates = req.body
        try {
            const updatedStudent = await db
                .collection('students')
                .updateOne({ _id: req.params.id }, { $set: updates })

            if (updatedStudent.matchedCount === 0)
                return res.status(404).json({ error: 'Student not found' })

            res.status(200).json({ message: 'Student updated successfully' })
        } catch (err) {
            res.status(400).send(err.errInfo)
            // console.error('Error updating :', err);
            // res.status(500).json({ error: 'Internal server error' });
        }
    })

    // Delete a student
    router.delete('/students/:id', validId, async (req, res) => {
        try {
            const studentId = req.params.id
            // Check if student Exists
            const foundStudentDoc = await db
                .collection('students')
                .findOne({ _id: studentId }, { projection: { password: 0 } })

            if (!foundStudentDoc)
                return res.status(404).json({ error: 'Student not found' })

            // Delete the result
            const studentDoc = await db
                .collection('students')
                .deleteOne({ _id: studentId })

            if (studentDoc.deletedCount === 0) {
                return res.status(404).json({ error: 'Student not found' })
            }

            // Delete corresponding result
            if (foundStudentDoc.result) {
                const deleteResult = await db
                    .collection('results')
                    .deleteOne({ _id: foundStudentDoc.result })

                if (deleteResult.deletedCount === 0) {
                    return res
                        .status(404)
                        .json({ error: 'Result of student not deleted' })
                }
            }

            res.status(200).send({ message: 'student deleted successfully' })
        } catch (err) {
            res.status(500).send({ error: 'Internal server error' })
        }
    })

    return router
}

module.exports = routes
