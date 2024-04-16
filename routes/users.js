const express=require('express');

const authorize=require('../middleware/userauthentication');

const router=express.Router();

const users=require('../controllers/users');

router.post('/create-group',authorize.authenticate,users.createGroup);

module.exports=router;