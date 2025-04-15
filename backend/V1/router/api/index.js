

const router = require('express').Router();

router.use('/auth', require('./auth.router'));
router.use('/product', require('./product.router'));

module.exports = router;
