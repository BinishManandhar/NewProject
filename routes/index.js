var express = require('express');
var path = require('path');
var router = express.Router();

var Posts = require('../models/posts');
var Users = require('../models/users');
var fileUpload = require('../file-upload');


router.get('/', function (req, res, next) {
    Posts.find({}).then(data => {
        res.render('index', { data: data });
    }).catch(err => {
        res.render('error', { layout: 'unauthorized', error: err });
    });

});

router.get('/create', function (req, res) {
    res.render('postadd', { data: {}, where: "Create", button: "Submit" });
});

router.get('/edit/:slug?', (req, res) => {
    var slug = req.params.slug;
    Posts.findOne({ Slug: slug }).then(data => {
        res.render('postadd', { data: data, where: "Edit", button: "Update" });
    }).catch(err => {
        res.render('error', { message: err.message });
    });
});

router.post('/create', function (req, res) {
    fileUpload.uploadFeaturedImage(req, res, (err) => {
        if (err) {
            res.render('error', { message: err.message });
        }
        else {
            if (req.file != "undefined" && req.file) {
                req.file.path = path.normalize(req.file.path);
                var fP = req.file.path.replace("public\\", "").replace("public/", "");
                req.body.FeaturedImage = fP;
            }
            if (req.body.Parent == "") {
                req.body.IsParent = "false";
            } else { req.body.IsParent = "true"; }

            Posts.updateOne({ Slug: req.body.Slug }, req.body, { runValidators: true, upsert: true }).then(result => {
                res.redirect('/index');
            }).catch(err => {
                res.render('error', { message: err.message });
            });
        }
    });
});

router.get('/delete/:slug?', function (req, res, next) {
    var slug = req.params.slug;
    Posts.deleteOne({ Slug: slug }).then(result => {
        res.redirect('/index/users');
    }).catch(err => {
        next(err);
    });
});

router.get('/users', (req, res, next) => {
    Users.find({}).then(data => {
        res.render('userboard', { data: data });
    }).catch(err => {
        res.render('error', { layout: 'unauthorized', error: err });
    });
});

router.get('/users/add', (req, res, next) => {
    res.render('useradd', { data: {}, where: "Add", button: "Create" });
});

router.post('/users/add', (req, res, next) => {
    Users.update({ Email: req.body.Email }, req.body, { upsert: true }).then(result => {
        res.redirect('/index/users');
    }).catch(err => {
        next(err);
    });
});

router.get('/users/edit/:username?', (req, res, next) => {
    var username = req.params.username;
    Users.findOne({ UserName: username }).then(data => {
        res.render('useradd', { data: data, where: "Edit", button: "Update" });
    }).catch(err => {
        next(err);
    });

});

router.get('/users/delete/:username?', (req, res, next) => {
    var username = req.params.username;
    Users.deleteOne({ UserName: username }).then(data => {
        res.redirect('/index/users/');
    }).catch(err => {
        next(err);
    });
});

router.get('/parent/:parent?/:slug?', (req, res, next) => {
    var slug = req.params.slug;
    var parent = req.params.parent;
    if (parent == "none") {
        parent = "";
    }
    Posts.updateOne({ Slug: slug }, { Parent: parent }).then(data => {
        res.redirect('/index');
    }).catch(err => {
        next(err);
    });
});



module.exports = router;