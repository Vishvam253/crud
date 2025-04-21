const mongoose = require('mongoose');

var productModel = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
       
        code: {
            type: String,
            required: true,
            unique: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        manufactureDate: {
            type: Date,
            required: true
        },
        expiryDate: {
            type: Date,
            required: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true
        },
        status: {
            type: String,
            enum: ["Available", "Unavailable"],
            required: true
        },
        images: {
            type: [String],
            required: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: true
        },
        priceChangedDate: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);
const products = mongoose.model("products", productModel);
// return Tutorial;

module.exports = products;