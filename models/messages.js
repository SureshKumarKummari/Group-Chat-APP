const Sequelize=require("sequelize");

const sequelize=require("../util/database");

const message=sequelize.define('messages',{
    id:{
        autoIncrement:true,
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
    },
    userId:Sequelize.INTEGER,
    message:Sequelize.STRING,
})


module.exports=message;
