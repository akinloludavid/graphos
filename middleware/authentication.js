const jwt = require('jsonwebtoken')
const {UsersModel} = require('../models/userModel')
exports.userAuth = async (req, res, next) => {

  if(req.headers.authorization){
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decodedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await UsersModel.findById({
        _id: decodedToken.id
      });
      if (!user) {
        return res.status(400).json({
          message:"invalid token",
          status:'error'
        });
      } else {
        req.user = user;
      }
    } catch (err) {
      return res.status(400).json({
        'error': err.message
      });
    }

  }
   else {
    return res.status(401).json({
      message:"not authorized",
      status:'error'
    });
  }
  next();

};
