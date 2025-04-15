const express = require('express');
const router = express.Router();    
const categoryController = require('../../controller/category.controller');

router.post('/add', categoryController.addCategory);
router.get('/get', categoryController.getAllCategories);
router.delete('/delete/:id', categoryController.deleteCategory);
router.put('/update/:id', categoryController.updateCategory); 

module.exports = router;