require('dotenv').config();

const users=require('../models/users');

const secretKey = process.env.SECRET_KEY;

const jwt = require('jsonwebtoken');

exports.token =(id)=>{
     return jwt.sign({userId:id}, secretKey, { expiresIn: '1h' });
}

exports.authenticate=(req,res,next)=>{
    const token=req.header('Autherization');
    //console.log(token);
    const user=jwt.verify(token, secretKey);
    users.findByPk(user.userId)
    .then(response=>{
        req.user=response;
        next();
    }).catch(err=>{
        console.log(err);
        return res.status(401).json({success:false});
    });
}