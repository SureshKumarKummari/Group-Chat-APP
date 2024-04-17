const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const links=sequelize.define('links',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true,
    },
    userid:Sequelize.INTEGER,
    group_id:Sequelize.INTEGER,
});

module.exports=links;