//Modelo de datos
const mongoose = require("mongoose");

//Mongo DB modelo
const userSchema = mongoose.Schema({
    fullName: {type: String, required: true},
    userName: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    profilePic: {type: String, default: ""},
    password: {type: String, required: true},
    profilePic: {type: String, default: ""},
},
{
    tinestamps: true,
})


userSchema.set("toJSON",{
    transform(doc, ret){
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        /* delete ret.password; */
    }
})


//Mongo DB Model
const User = mongoose.model("User", userSchema);

module.exports = User;