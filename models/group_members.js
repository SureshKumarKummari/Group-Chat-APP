const Sequelize=require("sequelize");

const sequelize=require("../util/database");

const group_members=sequelize.define('group_members',{
    group_member_id:{
        autoIncrement:true,
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
    },
    user_id:Sequelize.INTEGER,
    group_id:Sequelize.INTEGER,
})


module.exports=group_members;