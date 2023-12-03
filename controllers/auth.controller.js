const service = require('../services/user.service');
const { validatePassword, hashPassword } = require('../utils/bycrypt');
const { ERR, LOGIN_NOT_AUTH, REGISTER_ALREADY_EXIST } = require('../utils/errors');
const jwt = require('../utils/jwt');

module.exports = {
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const user = await service.getUserByEmail(email);
            if (!user) {
                return next(LOGIN_NOT_AUTH);
            }
            const isValid = await validatePassword(password, user.password);
            if (!isValid) {
                return next(LOGIN_NOT_AUTH);
            }
            service.clearUser(user);
            const token = jwt.sign({ id: user.id });
            console.log(token)
            //res.cookie('token', token, { httpOnly: true }).json();
            res.send({ token }).json();
        } catch (error) {
            console.log(error);
            next("Backend didn't even pass");
        }
    },
    signup: async (req, res, next) => {
        try {
            const { firstName, lastName, email, phone, password } = req.body;
            const user = await service.getUserByEmail(email);
            if (user) {
                return next(REGISTER_ALREADY_EXIST);
            }
            const hash = await hashPassword(password);
            const newId = await service.addUser(req.body, hash);
            console.log(hash)
            res.send({ id: newId });
        } catch (error) {
            console.log(error);
            next(ERR);
        }
    },
    getCurrentUser: async (req, res, next) => {
        try {
            const { authorization } = req.headers;
            if (!authorization) {
                return res.status(200).send(null);
            }
            const decodedToken = jwt.decode(JSON.parse(authorization));
            if (!decodedToken) {
                return res.status(200).send(null);
            }
            const { id } = decodedToken;
            const currentUser = await service.getUserById(id);
            res.status(200).send(currentUser);
            console.log(currentUser)
        } catch (error) {
            next(error);
        }
    }
}