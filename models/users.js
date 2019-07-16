var mongoose = require('mongoose');

const { Schema } = mongoose;
const UserSchema = new Schema({
    Email: {
        type: String,
        required: true,
        unique: false
    },
    FullName: {
        type: String,
    },
    UserName: {
        type: String,
        unique: true
    },
    AliasName: {
        type: String
    },
    Password: {
        type: String,
        require: true
    },
    Phone: {
        type: String,
        require: true
    },
    Role: {
        type: String,
        require: true
    },
    Menus: {
        type: String,
    },
    IsActive: {
        type: Number,
        default: 1
    }
});

UserSchema.statics.authenticate = function (req, res, callback) {
    var username = req.body.Username;
    var password = req.body.Password;

    this.model('User').findOne({ UserName: username }).exec(
        function (err, user) {
            console.log(user);
            if (err) {
                return callback(err);
            }
            else if (!user) {
                err = new Error("User not found");
                err.status = 401;
                return callback(err);
            }
            else if (user.Password == password) {
                return callback(null, user);
            }
            else {
                return callback();
            }
        }
    );
}

module.exports = mongoose.model('User', UserSchema, 'User');