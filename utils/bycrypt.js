const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    hashPassword: (password) => {
        return new Promise((res, rej) => {
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) {
                    return rej(err)
                } else {
                    return res(hash)
                }
            })
        })
    },
    validatePassword: (password, hash) => {
        return new Promise((res, rej) => {
            bcrypt.compare(password, hash, function (err, result) {
                if (err) {
                    return rej(err);
                } else {
                    return res(result);
                }
            });
        })
    }
}