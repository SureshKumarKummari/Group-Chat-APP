const Sequelize=require("sequelize");

const sequelize=require("../util/database");

const group=sequelize.define('groupes',{
    group_id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
    },
    group_name:Sequelize.STRING,
    group_admin:
    {
        type:Sequelize.STRING,
        defaultValue:"admin",
    }
})


module.exports=group;