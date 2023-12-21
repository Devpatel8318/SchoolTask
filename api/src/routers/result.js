const express = require('express')
const validId = require('../middleware/validId')
const { ObjectId } = require('mongodb')
const router = new express.Router()

const pipeline = (argument) => [
    {
        $match: argument,
    },
    {
        $addFields: {
            convertedStudentId: { $toObjectId: '$Student' },
        },
    },
    {
        $lookup: {
            from: 'students',
            localField: 'convertedStudentId',
            foreignField: '_id',
            as: 'studentInfo',
        },
    },
    {
        $unwind: '$studentInfo',
    },
    {
        $lookup: {
            from: 'subjects',
            localField: 'Marks.sub_code',
            foreignField: '_id',
            as: 'subjectInfo',
        },
    },
    {
        $project: {
            _id: 1,
            Signed_By: 1,
            Marks: 1,
            'studentInfo._id': 1,
            'studentInfo.firstName': 1,
            'studentInfo.lastName': 1,
            'studentInfo.email': 1,
            subjectInfo: 1,
        },
    },
]
const transformDoc = (resultDoc) => {
    return {
        _id: resultDoc[0]._id,
        Signed_By: resultDoc[0].Signed_By,
        studentInfo: resultDoc[0].studentInfo,
        Marks: resultDoc[0].Marks.map((mark) => {
            const correspondingSubject = resultDoc[0].subjectInfo.find(
                (subject) => subject._id === mark.sub_code
            )
            return {
                sub_code: mark.sub_code,
                marks: mark.marks,
                name: correspondingSubject.name,
                credit: correspondingSubject.credit,
                maximumMarks: correspondingSubject.maximumMarks,
                description: correspondingSubject.description,
            }
        }),
    }
}

const routes = (db) => {
    //get all Results
    router.get('/results', async (req, res) => {
        try {
            const results = await db.collection('results').find().toArray()
            res.status(200).send(results)
        } catch (err) {
            res.status(500).send({ error: err })
        }
    })

    // get single Result in Raw Format
    router.get('/results/:id', validId, async (req, res) => {
        try {
            const resultDoc = await db
                .collection('results')
                .findOne({ _id: req.params.id })

            if (!resultDoc)
                return res.status(404).json({ error: 'Result not found' })

            res.status(200).send(resultDoc)
        } catch (err) {
            res.status(500).send({ error: 'Internal server error' })
        }
    })

    //get single Result in formatted Result using Result Id
    router.get('/results/formatted/:id', validId, async (req, res) => {
        try {
            const resultDoc = await db
                .collection('results')
                .aggregate(
                    pipeline({
                        _id: req.params.id,
                    })
                )
                .toArray()

            if (!resultDoc || resultDoc?.length === 0)
                return res.status(404).json({ error: 'Result not found' })

            res.status(200).send(transformDoc(resultDoc))
        } catch (err) {
            console.log(err)
            res.status(500).send({ error: 'Internal server error' })
        }
    })

    //get single Result in formatted Result using Student Id
    router.get('/results/formatted/students/:id', async (req, res) => {
        try {
            const resultDoc = await db
                .collection('results')
                .aggregate(
                    pipeline({
                        Student: req.params.id,
                    })
                )
                .toArray()

            if (!resultDoc || resultDoc?.length === 0)
                return res.status(404).json({ error: 'Result not found' })

            res.status(200).send(transformDoc(resultDoc))
        } catch (err) {
            console.log(err)
            res.status(500).send({ error: 'Internal server error' })
        }
    })

    // Create Result
    router.post('/results', async (req, res) => {
        try {
            const resultDoc = await db.collection('results').insertOne(req.body)

            if (!resultDoc) {
                return res
                    .status(500)
                    .send({ error: 'Failed to create Result' })
            }

            const updatedStudent = await db
                .collection('students')
                .updateOne(
                    { _id: new ObjectId(req.body.Student) },
                    { $set: { result: resultDoc.insertedId } }
                )

            if (!updatedStudent) {
                return res
                    .status(500)
                    .send({ error: 'Failed to update Student' })
            }

            res.status(201).send(resultDoc.insertedId)
        } catch (err) {
            if (err.code === 11000) {
                return res.status(409).send({ error: 'Result Already Exists' })
            }
            res.status(500).send(err.errInfo)
        }
    })

    // Update Result
    router.patch('/results/:id', validId, async (req, res) => {
        const updates = req.body

        if (req.body.Student)
            try {
                const updatedResult = await db
                    .collection('results')
                    .updateOne({ _id: req.params.id }, { $set: updates })

                if (updatedResult.matchedCount === 0) {
                    return res.status(404).json({ error: 'Result not found' })
                }

                res.status(200).json({ message: 'Result updated successfully' })
            } catch (err) {
                res.status(400).send(err.errInfo || err)
            }
    })

    // Delete Result
    router.delete('/results/:id', validId, async (req, res) => {
        try {
            const resultId = req.params.id

            // Check if the result exists
            const foundDoc = await db
                .collection('results')
                .findOne({ _id: resultId })
            if (!foundDoc) {
                return res.status(404).json({ error: 'Result not found' })
            }

            // Delete the result
            const deleteResult = await db
                .collection('results')
                .deleteOne({ _id: resultId })
            if (deleteResult.deletedCount === 0) {
                return res.status(404).json({ error: 'Result not Deleted' })
            }

            // Update the student to remove reference to this result
            const updatedStudent = await db
                .collection('students')
                .updateOne(
                    { _id: new ObjectId(foundDoc.Student) },
                    { $unset: { result: '' } }
                )

            if (updatedStudent.modifiedCount === 0) {
                return res
                    .status(500)
                    .json({ error: 'Failed to update Student' })
            }

            res.status(200).json({ message: 'Result deleted successfully' })
        } catch (err) {
            res.status(500).json({ error: 'Internal server error' })
        }
    })

    return router
}

module.exports = routes
