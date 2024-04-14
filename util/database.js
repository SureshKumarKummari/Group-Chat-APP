const Sequelize=require('sequelize');

const database=new Sequelize('groupchat','root','SUresh@1289',{
    dialect:'mysql',
    host: 'localhost',
})

module.exports=database;