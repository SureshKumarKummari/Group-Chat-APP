const users=require('../models/users');


const bcrypt=require('../util/bcrypt');

exports.signup=async(req,res,next)=>{
    try{
        console.log(req.body);
   const user=await users.findOne({ where: { email: req.body.email } })
    if (!user) {
         bcrypt.decrypt(req.body.password)
          .then((pass) => {
            return users.create({
              username: req.body.username,
              email: req.body.email,
              phone:req.body.phone,
              password: pass,
            });
        });
        res.status(200).send(user);
    }else{
        throw new error("User already Exists!");
    }
    }
    catch(err){
        console.log(err);
        res.status(404).json({ error: "User already exists!" });
    }

}