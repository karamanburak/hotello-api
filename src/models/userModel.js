"use strict";
/* -------------------------------------------------------
    EXPRESS - HOTEL API
------------------------------------------------------- */
const { mongoose } = require("../configs/dbConnection");
/* ------------------------------------------------------- */

const UserSchema = new mongoose.Schema = ({
    username: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minLength: 8,
        // select:false
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        // validate: [
        //     (email) => email.includes("@") && email.split("@")[1].includes("."),
        //     "Email is invalid!",
        // ],
        validate:[validator.isEmail, "Please provide a valid email"]
    },
    isActive:{
        type:Boolean,
        default:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
}, {
    collection:"user",
    timestamps:true
})

module.exports = mongoose.model("UserModel", UserSchema)