const Multer = require('multer');
const path = require('path');

module.exports = {
    // storage: new multer.diskStorage({
    //     destination: path.resolve(__dirname, '..', '..', 'uploads'),
    //     filename: function(req, file, cb){
    //         cb(null, file.originalname);
    //     }
    // })
    storage: Multer.memoryStorage({
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    }),
    limits: {
        fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    }
}
