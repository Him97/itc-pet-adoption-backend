const ajv = require('./ajv');

module.exports = {
    user: {
        type: 'object',
        properties: {
            firstName: {
                type: 'string',
                isNotEmpty: true
            },
            lastName: {
                type: 'string',
                isNotEmpty: true
            },
            email: {
                type: 'string',
                isNotEmpty: true,
                format: 'email'
            },
            phone: {
                type: 'string',
                isNotEmpty: true,
            },
            password: {
                type: 'string',
                isNotEmpty: true
            },
            bio: {
                type: 'string'
            },
        },
        required: ['firstName', 'lastName', 'email', 'phone', 'password'],
        additionalProperties: false,
    },

    pet: {
        type: 'object',
        properties: {
            type: {
                type: 'string',
                isNotEmpty: true
            },
            name: {
                type: 'string',
                isNotEmpty: true
            },
            adoptionStatus: {
                type: 'string',
                isNotEmpty: true,
            },
            picture: {
                type: 'picture',
                isNotEmpty: true,
            },
            height: {
                type: 'number',
                isNotEmpty: true
            },
            weight: {
                type: 'number',
                isNotEmpty: true
            },
            color: {
                type: 'string',
                isNotEmpty: true
            },
            bio: {
                type: 'string',
                isNotEmpty: true
            },
            hypoallergenic: {
                type: 'boolean',
                isNotEmpty: true
            },
            dietaryRestrictions: {
                type: 'string',
                isNotEmpty: true
            },
            breed: {
                type: 'string',
                isNotEmpty: true
            },
        },
        required: ['type', 'name', 'adoptionStatus', 'image', 'height', 'weight', 'color', 'bio', 'hypoallergenic', 'dietaryRestrictions', 'breed'],
        additionalProperties: false,
    },

    validate: (schema) => {
        return (req, res, next) => {
            const data = req.body;
            const validate = ajv.compile(schema);
            const isValid = validate(data);
            if (!isValid) {
                const message = validate.errors.map(item => {
                    return `${item.instancePath.slice(1)} : ${item.message}`
                }).join(', ')
                return next([400, message])
            }
            next();
        }
    }
};