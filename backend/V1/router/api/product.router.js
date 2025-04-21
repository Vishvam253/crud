const router = require('express').Router();
const productController = require('../../controller/product.controller');

const upload = require('../../middleware/fileUpload')
const verifyToken = require('../../middleware/verifyToken');


router.post('/add', upload.array("productImages", 5), verifyToken, productController.add);
router.get('/get', verifyToken, productController.get);
router.delete('/delete/:id', verifyToken, productController.delete);
router.put('/update/:id', verifyToken, upload.array("productImage", 5), productController.update);
router.get('/:id', productController.getById);

module.exports = router;
    