const express=require('express');

const authorize=require('../middleware/userauthentication');

const router=express.Router();

const message=require('../controllers/messages');

router.post('/sendmessage',authorize.authenticate,message.postMessage);


module.exports=router;