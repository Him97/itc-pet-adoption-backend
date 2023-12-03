const jwt = require('jsonwebtoken');
const sercetKey = process.env.JWT_SECRET_KEY;

module.exports = {
    sign: (payload) => {
        const token = jwt.sign(payload, sercetKey, { expiresIn: '3d' });
        return  token
    },
    verify: (token) => {
        const payload = jwt.verify(token, sercetKey);
        return payload;
    },
    decode: (token) => {
        const payload = jwt.decode(token, sercetKey);
        return payload;
    },
}