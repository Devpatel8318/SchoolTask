const subjectSchema = {
    bsonType: 'object',
    required: ['name', 'credit', 'maximumMarks', '_id'],
    properties: {
        _id: {
            bsonType: 'string',
        },
        name: {
            bsonType: 'string',
            minLength: 5,
        },
        credit: {
            bsonType: 'number',
        },
        maximumMarks: {
            bsonType: 'number',
        },
        description: {
            bsonType: 'string',
            maxLength: 100,
        },
    },
    additionalProperties: false,
}
module.exports = subjectSchema
