const {Router}=require('express');

const router=Router();

const admin=require('../controllers/admin');

router.post('/signup',admin.signup);

router.get('/login/:email/:password',admin.login);

module.exports=router;