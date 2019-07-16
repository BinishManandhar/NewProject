var multer = require('multer');
var path = require('path');
var fse = require('fs-extra');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var filePath = `./public/uploads/${year}/${month}/${day}/`;
        filePath = path.normalize(filePath);
        fse.ensureDirSync(filePath);
        cb(null, filePath);
    },
    filename: function (req, file, cb) {
        var date = new Date();
        var idx = file.originalname.lastIndexOf(".");
        var beforeDot = file.originalname.substring(0, idx) + '-' + date.getTime();
        var afterDot = '.' + file.originalname.substring(idx + 1);
        var newFile = beforeDot + afterDot;
        cb(null, newFile);
    }
});

var fileFilter = function (req, file, cb) {
    var filetypes = /jpeg|jpg|png/i;
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
        return cb(null, true);
    }
    cb("Error: File upload only supports the following filetypes - " + filetypes);
};

var uploadDetailImage = multer({
    fileFilter: fileFilter,
    storage: storage
}).single('DetailImage');

var uploadFeaturedImage = multer({
    fileFilter: fileFilter,
    storage: storage
}).single('FeaturedImage');


module.exports = {
    uploadDetailImage: function (req, res, err) { return uploadDetailImage(req, res, err); },
    uploadFeaturedImage: function (req, res, err) { return uploadFeaturedImage(req, res, err); }
}