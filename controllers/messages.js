const messagemodel = require('../models/messages');
const Sequelize=require('sequelize');

exports.postMessage = async (req, res, next) => {
    try {
        console.log("I am in POST message!", req.body.message, req.user.id);
        const result = await messagemodel.create({
            message: req.body.message,
            userId: Number(req.user.id)
        });
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Can't send message" });
    }
}


exports.getMessages=async(req,res,next)=>{
    try {
        let result;
        if(req.query.idisgreater){
            console.log(req.query.idisgreater);
            result = await messagemodel.findAll({ where: { userId: { [Sequelize.Op.gt]: req.query.idisgreater } } });
        }else{
            result = await messagemodel.findAll();
        }
        if(result){
                res.status(200).json(result);
        }else{
            throw err;
        }
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Can't send message" });
    }
}
