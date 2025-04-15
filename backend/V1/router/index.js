

const router = require('express').Router();


router.use("/auth", require("./api/auth.router"));
router.use("/product", require("./api/product.router"));
router.use("/category", require("./api/category.router"));

// Debugging route
router.get("/test", (req, res) => {
    res.send("API is working!");
});


module.exports = router;
        