const basicNoteSchema = {
    bsonType: 'object',
    additionalProperties: false,
    required: ['front', 'back', 'type'],
    properties: {
        _id: {
            bsonType: 'objectId'
        },
        front: {
            bsonType: 'string'
        },
        back: {
            bsonType: 'string'
        },
        type: {
           enum: ['basicNote']
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
        },
        type: {
            enum: ['clozeNote']
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