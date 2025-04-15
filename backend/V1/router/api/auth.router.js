const router = require('express').Router();
const authController = require('../../controller/auth.controller');
const verifyToken = require('../../middleware/verifyToken')

console.log("router loaded");

router.get('/protected', verifyToken, (req, res)=>{
    res.json({message: "Token is valid", userId: req.userId})
})

router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;
