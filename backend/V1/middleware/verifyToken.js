const jwt = require('jsonwebtoken');
function verifyToken(req, res, next) {

    const authHeader = req.header('Authorization');
    if (!authHeader){
        return res.status(401).json({ error: 'Access denied' });
    } 
    const token = authHeader.startsWith("Bearer") ? authHeader.split(" ")[1]: authHeader;
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.userId = decoded.userId;
        req.role = decoded.role; 
        console.log("Logged-in Role:", req.role); 
        next();
    } catch (error) {
       return res.status(401).json({ error: 'Invalid token' });
    }
    
};

module.exports = verifyToken; 