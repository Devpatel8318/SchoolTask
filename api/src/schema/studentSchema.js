const studentSchema = {
    bsonType: 'object',
    required: ['firstName', 'lastName', 'email', 'password'],
    properties: {
        _id: {
            bsonType: 'objectId',
        },
        firstName: {
            bsonType: 'string',
            minLength: 6,
            maxLength: 25,
        },
        lastName: {
            bsonType: 'string',
            minLength: 6,
            maxLength: 25,
        },
        email: {
            bsonType: 'string',
            pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        },
        password: {
            bsonType: 'string',
            minLength: 6,
        },
        result: {
            bsonType: 'objectId',
        },
    },
    additionalProperties: false,
}

module.exports = studentSchema
