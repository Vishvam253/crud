const category = require('../model/category');

exports.addCategory = async(req, res) =>{
    try{
        const {name} = req.body;
        const existing = await category.findOne({ name: name.trim() });
        if (existing) {
          return res.status(400).json({ success: false, message: "Category already exists" });
        }
        const newCategory = await category.create({name: name.trim()});
        return res.status(201).json({success: true, message: 'Category added', data: newCategory});
    }catch(error){  
        
        return res.status(500).json({success: false, message: "server error"});
    }
};

exports.getAllCategories = async(req, res) => {
    try{
        const categories = await category.find();
        return res.status(200).json({success: true, data: categories})
    }catch(error){
        console.error("error fetching category", error);        
        return res.status(500).json({success: false, message: "Failed to get categories"});
    }
};

exports.deleteCategory = async (req, res)=>{
    try {
        const deleted = await category.findByIdAndDelete(req.params.id)
        if(!deleted){
            return res.status(402).json({success: false, message: "Category not found"})
        }
        return res.status(200).json({success: true, message: "Category deleted successfully"});
    } catch (error) {
        console.error("error delete category", error)
        return res.status(500).json({success: false, message: "Server error while delete"})
    }
};

exports.updateCategory = async(req, res) => {
    try{
        const {name} = req.body;
        const updated = await category.findByIdAndUpdate(req.params.id, {name}, {new: true});
        if(!updated){
            return res.status(404).json({success: false, message: "Category not found"});
        }
        return res.status(200).json({success: true, message: "Category updated successfully"});
    }catch(error){
        console.error("Error update category", error)
        return res.status(500).json({success: false, message: "server error while update"})
    }
};