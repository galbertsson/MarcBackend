const basicNoteSchema = {
    bsonType: 'object',
    required: ['front', 'back'],
    properties: {
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
    required: ['text'],
    properties: {
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
            properties: {
                title: {
                    bsonType: 'string'
                }
            }
        }
    }
};

export default deckSchema;