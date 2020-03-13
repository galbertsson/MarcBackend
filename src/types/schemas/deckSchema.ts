const basicNoteSchema = {
    bsonType: 'object',
    additionalProperties: false,
    required: ['front', 'back'],
    properties: {
        _id: {
            bsonType: 'objectId'
        },
        front: {
            bsonType: 'string'
        },
        back: {
            bsonType: 'string'
        }
    }
};

const clozeNoteSchema = {
    bsonType: 'object',
    additionalProperties: false,
    required: ['text'],
    properties: {
        _id: {
            bsonType: 'objectId'
        },
        text: {
            bsonType: 'string'
        }
    }
};

const deckSchema = {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            additionalProperties: false,
            required: ['_id', 'ownerId', 'title', 'notes'],
            properties: {
                _id: {
                    bsonType: 'objectId'
                },
                ownerId: {
                    bsonType: 'objectId'
                },
                title: {
                    bsonType: 'string'
                },
                notes: {
                    bsonType: 'array',
                    items: {
                        anyOf: [
                            basicNoteSchema,
                            clozeNoteSchema
                        ]
                    }
                }
            }
        }
    }
};

export default deckSchema;