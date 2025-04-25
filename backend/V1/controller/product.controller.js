

const db = require("../model/index");
const products = db.products;
const moment = require('moment');
const Category = require('../model/category');

exports.add = async (req, res, next) => {

    try {
        let { name, code, price, manufactureDate, expiryDate, status, category: categoryId} = req.body;
        let { path } = req.files;
        console.log("file info", req.file)
        
        console.log("Request Body:", req.body); 
        console.log("Uploaded Files:", req.files); 
        
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({success: false, message: "Product image is required!"});
        }

       
        const categoryData = await Category.findById(categoryId.trim());
        if (!categoryData) {
      return res.status(404).json({ message: "Category not found" });
    }

        const imagePaths = req.files.map(file => file.path);

        if (!name || !code || !price || !categoryId || !manufactureDate || !expiryDate) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        const productData = await products.findOne({ code: code });
        if (productData) {
          return res.json({ "success": false, "message": "Product code is already existing!!" });
        } else {
            const newProduct = new products({
                name: name,
                code: code,
                price: price,
                category: {
                  _id: categoryData._id,
                  name: categoryData.name,
                },
                manufactureDate: new Date(manufactureDate),
                expiryDate: new Date(expiryDate),
                owner: req.userId,
                status: status,
                images: imagePaths,
                priceChangedDate: null,
            });
            // console.log(newUsers)
            const product = await newProduct.save();
            res.json({ "success": true, "message": "Product added successfully!!", "data": product });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving tutorials."
        });
    }
};      

exports.getById = async (req, res) => {
    try {
        let { id } = req.params;
        const product = await products.findOne({ _id: id, isDeleted: false });
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.json({ success: true, data: product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving product" });
    }
};

exports.get = async (req, res, next) => {

    try {       
        let { search } = req.query;
        let where = {
            isDeleted: false,
            isActive: true
        }
        if (search) {
            where = {
                $and:[
                { isDeleted: false, isActive: true },
                { $or: [{ name: new RegExp(search, 'i') }, { category: new RegExp(search, 'i') }] }
                ]
            };
        }
        const productData = await products.find(where).populate("category", "name");
        res.json({ "success": true, "message": "Product data fetched successfully!!", "data": productData });


    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving tutorials."
        });
    }
};

exports.delete = async (req, res, next) => {

    try {
        let { id } = req.params;

        const productData = await products.findOne({ _id: id, isDeleted: false });
        // console.log(productData)
        if (!productData) {
            res.json({ "success": false, "message": "Product not found" });
        } else if (productData.owner.toString() !== req.userId) {
            res.json({ "success": false, "message": "You are not product owner so you can not delete this record" });
        } else {
            console.log('if')
            const deletedData = await products.deleteOne({ _id: id });
            console.log(deletedData)
            if (deletedData.deletedCount > 0) {
                res.json({ "success": true, "message": "Product deleted successfully!!", "data": id });
            } else {
                res.json({ "success": false, "message": "Product deleted failed!!", "data": id });
            }
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving tutorials."
        });
    }
};

exports.update = async (req, res) => {
    try {
        // console.log("Received params", req.params);
        // console.log("Received body",req.body);
        // console.log("Received file:", req.files); 
        
        if (req.file) 
            console.log(req.file); 

        const { id } = req.params;
        const productData = await products.findById(id);

        if (!productData) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        
        if (productData.owner.toString() !== req.userId) {
            return res.status(403).json({ success: false, message: "You are not the product owner, so you cannot update this record" });
        }   

        let updateData = {...req.body};

        // if price update is allowed
        if (req.body.price !== undefined && req.body.price !== productData.price) {
            if(productData.priceChangedDate){
                let lastUpdate = moment(productData.priceChangedDate);
                let todayStart = moment().startOf("day")

                if (lastUpdate.isAfter(todayStart)) {
                    // console.log("Price update denied, already updated today");
                    // return res.status(400).json({ success: false, message: "You can only update the price once per day" });
                    delete updateData.price;
                }else{
                    updateData.priceChangedDate = new Date();
                }
             }else{
                if(productData._id) {
                updateData.priceChangedDate = new Date();
                }
             }
        }

        if (req.files && req.files.length > 0) {
            const imagePaths = req.files.map(file => file.path);  // Map file paths for multiple images
            updateData.images = imagePaths;
            console.log("Updated image paths:", updateData.images);
        }

        const updatedProduct = await products.findByIdAndUpdate(id, { $set: updateData }, { new: true });

        res.json({ success: true, message: "Product updated successfully!", data: updatedProduct });
    } catch (error) {
        console.error(error);   
        res.status(500).json({ message: error.message || "Some error occurred while updating the product." });
    }
};