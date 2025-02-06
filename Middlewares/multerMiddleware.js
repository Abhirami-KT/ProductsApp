//in jwtMiddleware.js ->
const multer = require('multer')

const storage = multer.diskStorage({
    destination:(req,file,callback) => {
        callback(null,'./Uploads')
    },
    filename:(req,file,callback) => {
        callback(null,`projectImg-${file.originalname}`)
    }

})

const multerMiddleware = multer({
    storage
})

module.exports=multerMiddleware

