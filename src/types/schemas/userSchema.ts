const userSchema = {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            additionalProperties: false,
            required: ['_id', 'username', 'password'],
            properties: {
                _id: {
                    bsonType: 'objectId'
                },
                username: {
                    bsonType: 'string'
                },
                password: {
                    bsonType: 'string'
                }
            }
        }
    }
};

export default userSchema;