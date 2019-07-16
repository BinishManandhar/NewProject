var express = require('express');
var path = require('path');
var router = express.Router();

var fileUpload = require('../file-upload');

//create this route
router.post('/upload-detail-images', function (req, res) {
    fileUpload.uploadDetailImage(req, res, (err) => {
        if (err) {
            res.json({
                result: false,
                message: 'File format not supported'
            });
        } else {
            if (req.file != "undefined" && req.file) {
                req.file.path = path.normalize(req.file.path);
                var fP = req.file.path.replace("public\\", "").replace("public/", "");
            }
            res.json({
                url: `/${fP}`
            });
        }
    });

});

module.exports = router;