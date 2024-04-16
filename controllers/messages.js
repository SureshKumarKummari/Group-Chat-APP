const messagemodel = require('../models/messages');
const Sequelize=require('sequelize');

exports.postMessage = async (req, res, next) => {
    console.log(req.body.message);
    try {
        console.log("I am in POST message!", req.body.message, req.user.user_id);
        const result = await messagemodel.create({
            message: req.body.message,
            user_id: Number(req.user.user_id),
            //group_id: 0,
        });
        res.status(200).json({message:req.body.message});
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
            result = await messagemodel.findAll({ where: { user_id: { [Sequelize.Op.gt]: req.query.idisgreater } } });
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
