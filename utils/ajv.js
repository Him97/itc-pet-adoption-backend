
const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv({ allErrors: true }) // options can be passed, e.g. {allErrors: true}
addFormats(ajv);

ajv.addKeyword('isNotEmpty', {
    type: 'string',
    validate: function (schema, data) {
        return typeof data === 'string' && data.trim() !== ''
    },
    error: {
        message: 'string field must be non-empty'
    },
    errors: false
})

ajv.addKeyword('isNumber', {
    type: 'string',
    validate: function (schema, data) {
        return !isNaN(data);
    },
    error: {
        message: 'field must be a number'
    },
    errors: false
})

module.exports = ajv;