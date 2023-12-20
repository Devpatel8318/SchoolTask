const { ObjectId } = require('mongodb')

const validId = (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send({ error: 'Invalid ID' })
    } else {
        req.params.id = new ObjectId(req.params.id)
        next()
    }
}

module.exports = validId
