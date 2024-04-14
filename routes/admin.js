const {Router}=require('express');

const router=Router();

const admin=require('../controllers/admin');

router.post('/signup',admin.signup);

module.exports=router;