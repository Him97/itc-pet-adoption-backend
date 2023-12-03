require('dotenv').config();
require('./utils/postgres').run();
const express = require('express');
const cors = require('cors');
const cookies = require('cookie-parser');
const { ERR_TOKEN_NOT_VERIFIED } = require('./utils/errors');
const jwt = require('./utils/jwt');
const usersService = require('./services/user.service');
const app = express();

//middleware
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Credentials', true);
    next();
})
app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(cookies());
app.use(express.json());

app.use(async (req, res, next) => {
    console.log('method:', req.method, 'url:', req.url);
    const publicRoutes = [
        { method: 'POST', url: '/login' },
        { method: 'POST', url: '/signup' },
        { method: 'GET', url: '/login' },
        { method: 'GET', url: '/pet' },
        { method: 'GET', url: '/pet/:id' },
        { method: 'GET', url: '/user/:id' },
    ]
    const isPublic = publicRoutes.some(endpoint => req.url.startsWith(endpoint.url));
    if (isPublic) {
        return next();
    }

    const { authorization: token } = req.headers;
    if (!token) {
        return next(ERR_TOKEN_NOT_VERIFIED);
    }
    try {
        const payload = jwt.verify(JSON.parse(token));
        const user = await usersService.getUserById(payload.id);
        if (!user) {
            return next(ERR_TOKEN_NOT_VERIFIED);
        }
        if (!user.permissions) {
            user.permissions = [];
        }
        const permission = [];
        user.permissions.forEach(p => permission[p] = true);
        user.permission = permission;
        req.user = user;
        return next();
    } catch (error) {
        return next(ERR_TOKEN_NOT_VERIFIED);
    }
});

//routes
app.use('/', require('./routes/auth.routes'));
app.use('/user', require('./routes/user.routes'));
app.use('/pet', require('./routes/pet.routes'));

app.use((err, req, res, next) => {
    try {
        const [statusCode, msg] = err;
        res.status(statusCode).send({
            error: true,
            message: msg
        })
    } catch (error) {
        res.status(500).send({
            error: true,
            message: err.message
        })
    }
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`express is listening on port: ${PORT}`);
})