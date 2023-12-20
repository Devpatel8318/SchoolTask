const { MongoClient } = require('mongodb')
const studentSchema = require('../schema/studentSchema')
const subjectSchema = require('../schema/subjectSchema')
const resultSchema = require('../schema/resultSchema')

let dbConnection

const connectToDb = async (cb) => {
    MongoClient.connect(process.env.URL)
        .then(async (client) => {
            
            dbConnection = client.db()
            console.log('Connected to MongoDB')

            dbConnection.createCollection('students', {
                validator: { $jsonSchema: studentSchema },
            })
            dbConnection.createCollection('subjects', {
                validator: { $jsonSchema: subjectSchema },
            })
            dbConnection.createCollection('results', {
                validator: { $jsonSchema: resultSchema },
            })

            await dbConnection
                .collection('students')
                .createIndex({ email: 1 }, { unique: true })

            return cb()
        })
        .catch((err) => {
            console.log(err)
            return cb(err)
        })
}

const getDb = () => dbConnection

module.exports = {
    connectToDb,
    getDb,
}
