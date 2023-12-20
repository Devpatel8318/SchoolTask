const express = require('express')
const router = new express.Router()

const routes = (db) => {
    // get all subjects
    router.get('/subjects', async (req, res) => {
        try {
            const subjects = await db.collection('subjects').find().toArray()
            res.status(200).send(subjects)
        } catch (err) {
            res.status(500).send({ error: err })
        }
    })

    // get single subject
    router.get('/subjects/:id', async (req, res) => {
        const subjectId = req.params.id

        try {
            const subjectDoc = await db
                .collection('subjects')
                .findOne({ _id: subjectId })

            if (!subjectDoc)
                return res.status(404).json({ error: 'Subject not found' })

            res.status(200).send(subjectDoc)
        } catch (err) {
            res.status(500).send({ error: 'Internal server error' })
        }
    })

    // create subject
    router.post('/subjects', async (req, res) => {
        try {
            const subjectDoc = await db
                .collection('subjects')
                .insertOne(req.body)

            if (!subjectDoc) {
                return res
                    .status(500)
                    .send({ error: 'Failed to create Subject' })
            }

            res.status(201).send(subjectDoc.insertedId)
        } catch (err) {
            if (err.code === 11000) {
                return res
                    .status(409)
                    .send({ error: 'Subject Code Already Exists' })
            }
            res.status(500).send(err.errInfo)
        }
    })

    //update subject
    router.patch('/subjects/:id', async (req, res) => {
        const subjectId = req.params.id
        const updates = req.body

        try {
            const updatedSubject = await db
                .collection('subjects')
                .updateOne({ _id: subjectId }, { $set: updates })

            if (updatedSubject.matchedCount === 0)
                return res.status(404).json({ error: 'Subject not found' })

            res.status(200).json({ message: 'Subject updated successfully' })
        } catch (err) {
            res.status(400).send(err.errInfo || err)
        }
    })

    //delete student
    router.delete('/subjects/:id', async (req, res) => {
        const subjectId = req.params.id
        try {
            const subjectDoc = await db
                .collection('subjects')
                .deleteOne({ _id: subjectId })

            if (subjectDoc.deletedCount === 0)
                return res.status(404).json({ error: 'Subject not found' })

            res.status(200).send({ message: 'Subject deleted successfully' })
        } catch (err) {
            res.status(500).send({ error: 'Internal server error' })
        }
    })

    return router
}
module.exports = routes
