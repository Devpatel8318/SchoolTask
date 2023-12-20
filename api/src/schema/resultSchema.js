const resultSchema = {
    bsonType: 'object',
    required: ['Signed_By', 'Student', 'Marks'],
    properties: {
        _id: {
            bsonType: 'objectId',
        },
        Signed_By: {
            bsonType: 'string',
        },
        Student: {
            bsonType: 'string',
        },
        Marks: {
            bsonType: 'array',
            items: {
                bsonType: 'object',
                required: ['sub_code', 'marks'],
                properties: {
                    sub_code: {
                        bsonType: 'string',
                    },
                    marks: {
                        bsonType: 'int',
                    },
                },
            },
        },
    },
    additionalProperties: false,
}

module.exports = resultSchema
