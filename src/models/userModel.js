// ================ imports ===========================================================================================//

const mongoose = require("mongoose");

// ================ User Schema ===========================================================================================//

const userSchema = new mongoose.Schema(
{
    title : {
                type: String,
                required: true,
                enum: ["Mr", "Mrs", "Miss"],
                trim: true
            },
    name :  {
                type: String,
                required: true,
                trim: true
            },
    phone : {
                type: String,
                required: true,
                unique: true,
                trim: true
            },
    email : {
                type: String,
                required: true,
                unique: true,
                lowercase: true,
                trim: true
            },
    password :  {
                    type: String,
                    minlength: 8,
                    maxlength: 15,
                    required: true,
                },
    address :   {
                    street: { type: String },
                    city: { type: String },
                    pincode: { type: Number }
                },
},{ timestamps: true }
);

// ================ exports ===========================================================================================//

module.exports = mongoose.model("users", userSchema);