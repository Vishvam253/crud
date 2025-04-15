

const db = require("../model/index");
// const users = db.users;
const bcrypt = require('bcrypt')
const users = require("../model/users");
const jwt = require('jsonwebtoken');
// const verifyToken = require("../middleware/verifyToken");

exports.login = async (req, res, next) => {

    try {
        let { email, password } = req.body;
        const userData = await users.findOne({ email: email });

        if (!userData) {
           return res.json({ "success": false, message: "User not found" });
        }
        const passwordMatch = await bcrypt.compare(password, userData.password);
       
        if (passwordMatch) {
           return res.json({ "success": true, message: "Password is true" });
        }
        console.log("User Data:", userData); 
        console.log("SECRET_KEY:", process.env.SECRET_KEY);

        // Ensure userData has _id and role
        if (!userData._id || !userData.role) {
            console.error("Error: userData._id or userData.role is missing");
            return res.status(500).json({ "success": false, message: "Server error: Invalid user data" });
        }

        // Generate Token
        const token = jwt.sign(
            { userId: userData._id, role: userData.role }, 
            process.env.SECRET_KEY, 
            { expiresIn: '1d' } 
        );
       
        console.log("generated token", token);
        
      return res.json({ "success": true, message: "Login successfully!!", token });
    
    } catch (error) {
        console.log("Login error:", error)
        res.status(500).json({
          message: "Server error"
        });
    }
};

exports.register = async (req, res, next) => {
     console.log("register called", req.body);
     
    try {
        let { name, email, password } = req.body;

        const userValue = await users.findOne({ email: email });
        console.log(userValue)
        if (userValue) {
            res.json({ "success": false, "message": "User already register" });
        } 
            console.log("plain password", password);
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            console.log("hashed pssword(register):", hashedPassword);
            
            const newUsers = new users({ name, email, password: hashedPassword});
            // console.log(newUsers)
            const userData = await newUsers.save();
            res.json({ "success": true, "message": "Register Successfully!!", "data": userData });
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving tutorials."
        });
    }
};