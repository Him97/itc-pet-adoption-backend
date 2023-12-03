const multer = require('multer');

const storage = multer.memoryStorage({
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const splt = file.originalname.split('.');
        const suffix = splt[splt.length - 1]; //fil.easd.na.jpg
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + suffix)
    }
});

module.exports = { upload: multer({ storage: storage }) };