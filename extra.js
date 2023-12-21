db.results.aggregate([
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
])

db.results.aggregate([
    {
        $lookup: {
            from: 'subjects',
            localField: 'Marks.sub_code',
            foreignField: '_id',
            as: 'subjectInfo',
        },
    },
])

db.results.aggregate([
    {
        $lookup: {
            from: 'subjects',
            localField: 'Marks.sub_code',
            foreignField: '_id',
            as: 'subjectInfo',
        },
    },
])[
    {
        _id: ObjectId('65818448e234893274ab2dd5'),
        Signed_By: 'Princple',
        Student: '6581430c1e4463f5f7adcaa9',
        Marks: [
            {
                sub_code: 'CE801',
                marks: 90,
                name: 'Maths',
                credit: 7,
                maximumMarks: 100,
                description:
                    'Science is a universal subject that spans the branch of knowledge that examines the structure.',
            },
            {
                sub_code: 'CE802',
                marks: 54,
                name: 'Science',
                credit: 8,
                maximumMarks: 100,
                description:
                    'Science is a universal subject that spans the branch of knowledge that examines the structure.',
            },
            {
                sub_code: 'CE803',
                marks: 88,
                name: 'Hindi',
                credit: 3,
                maximumMarks: 50,
                description:
                    'Science is a universal subject that spans the branch of knowledge that examines the structure.',
            },
        ],
    }
][
    {
        _id: '65818448e234893274ab2dd5',
        Signed_By: 'Princple',
        Marks: [
            {
                sub_code: 'CE801',
                marks: 90,
            },
            {
                sub_code: 'CE802',
                marks: 54,
            },
            {
                sub_code: 'CE803',
                marks: 88,
            },
        ],
        studentInfo: {
            _id: '6581430c1e4463f5f7adcaa9',
            firstName: 'Social',
            lastName: 'Pilott',
            email: 'socialpilot@gmail.com',
        },
        subjectInfo: [
            {
                _id: 'CE801',
                name: 'Maths',
                credit: 7,
                maximumMarks: 100,
                description:
                    'Science is a universal subject that spans the branch of knowledge that examines the structure.',
            },
            {
                _id: 'CE802',
                name: 'Science',
                credit: 8,
                maximumMarks: 100,
                description:
                    'Science is a universal subject that spans the branch of knowledge that examines the structure.',
            },
            {
                _id: 'CE803',
                name: 'Hindi',
                credit: 3,
                maximumMarks: 50,
                description:
                    'Science is a universal subject that spans the branch of knowledge that examines the structure.',
            },
        ],
    }
][
    {
        _id: ObjectId('65818448e234893274ab2dd5'),
        Signed_By: 'Princple',
        Student: '6581430c1e4463f5f7adcaa9',
        Marks: [
            { sub_code: 'CE801', marks: 90 },
            { sub_code: 'CE802', marks: 54 },
            { sub_code: 'CE803', marks: 88 },
        ],
        subjectInfo: [
            {
                _id: 'CE801',
                name: 'Maths',
                credit: 7,
                maximumMarks: 100,
                description:
                    'Science is a universal subject that spans the branch of knowledge that examines the structure.',
            },
            {
                _id: 'CE802',
                name: 'Science',
                credit: 8,
                maximumMarks: 100,
                description:
                    'Science is a universal subject that spans the branch of knowledge that examines the structure.',
            },
            {
                _id: 'CE803',
                name: 'Hindi',
                credit: 3,
                maximumMarks: 50,
                description:
                    'Science is a universal subject that spans the branch of knowledge that examines the structure.',
            },
        ],
    }
][
    {
        _id: ObjectId('65818448e234893274ab2dd5'),
        Signed_By: 'Princple',
        Student: '6581430c1e4463f5f7adcaa9',
        Marks: [
            {
                sub_code: 'CE801',
                marks: 90,
                name: 'Maths',
                credit: 7,
                maximumMarks: 100,
                description:
                    'Science is a universal subject that spans the branch of knowledge that examines the structure.',
            },
            {
                sub_code: 'CE802',
                marks: 54,
                name: 'Science',
                credit: 8,
                maximumMarks: 100,
                description:
                    'Science is a universal subject that spans the branch of knowledge that examines the structure.',
            },
            {
                sub_code: 'CE803',
                marks: 88,
                name: 'Hindi',
                credit: 3,
                maximumMarks: 50,
                description:
                    'Science is a universal subject that spans the branch of knowledge that examines the structure.',
            },
        ],
    }
]

const responseFromAggregiation = [
    {
        _id: '65818448e234893274ab2dd5',
        Signed_By: 'Princple',
        Marks: [
            {
                sub_code: 'CE801',
                marks: 90,
            },
            {
                sub_code: 'CE802',
                marks: 54,
            },
            {
                sub_code: 'CE803',
                marks: 88,
            },
        ],
        studentInfo: {
            _id: '6581430c1e4463f5f7adcaa9',
            firstName: 'Social',
            lastName: 'Pilott',
            email: 'socialpilot@gmail.com',
        },
        subjectInfo: [
            {
                _id: 'CE801',
                name: 'Maths',
                credit: 7,
                maximumMarks: 100,
                description:
                    'Science is a universal subject that spans the branch of knowledge that examines the structure.',
            },
            {
                _id: 'CE802',
                name: 'Science',
                credit: 8,
                maximumMarks: 100,
                description:
                    'Science is a universal subject that spans the branch of knowledge that examines the structure.',
            },
            {
                _id: 'CE803',
                name: 'Hindi',
                credit: 3,
                maximumMarks: 50,
                description:
                    'Science is a universal subject that spans the branch of knowledge that examines the structure.',
            },
        ],
    },
]

db.results.aggregate([
    {
        $match: {
            Student: '65826fca2577dacea9143152',
        },
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
])

db.students.aggregate([
    {
        $match: {
            Student: '65826fca2577dacea9143152',
        },
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
])

db.results.aggregate([
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
])
