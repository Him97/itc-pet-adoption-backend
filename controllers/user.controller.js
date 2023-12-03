const service = require('../services/user.service');
const { hashPassword } = require('../utils/bycrypt');
const { ERR, ERR_NOT_ALLOWED } = require('../utils/errors');

module.exports = {
    getUsers: async (req, res, next) => {
        try {
            const data = await service.getUsers();
            console.log('This is the data from GET /user:',data);
            res.send(data);
        } catch (error) {
            next(ERR);
        }
    },
    getUserById: async (req, res, next) => {
        try {
            const { userId } = req.params;
            const user = await service.getUserById(userId);
            res.send(user);
        } catch (error) {
            next(ERR);
        }
    },
    updateUser: async (req, res, next) => {
        const {id} = req.params;
        const body = req.body;
        console.log('This is the body from PUT /user:',body);
        console.log('This is the id from PUT /user:',id, req.user);
        try {
            if (req.body.id !== id && !req.user.permission.editor) {
                return next(ERR_NOT_ALLOWED);
            }
            await service.updateUser(id, body);
            res.send('User updated successfully');
        } catch (error) {
            console.error('Error updating user:', error);
            next(error);
        }
    },
    getUserByIdFull: async (req, res, next) => {
        try {
            const { userId } = req.params;
            const user = await service.getUserByIdFull(userId);
            res.send(user);
        } catch (error) {
            next(ERR);
        }
    },
}