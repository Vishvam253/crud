const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var usersModel = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['superuser', 'owner'],
            default: 'owner'
        }
    },
    { timestamps: true }
);

usersModel.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

usersModel.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};


const users = mongoose.model("users", usersModel);
// return Tutorial;

module.exports = users;