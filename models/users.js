const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const user=sequelize.define('users',{
    user_id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true,
    },
    username:Sequelize.STRING,
    email:Sequelize.STRING,
    phone:Sequelize.STRING,
    password:Sequelize.STRING,
});

module.exports=user;