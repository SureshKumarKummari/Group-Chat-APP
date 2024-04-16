// const Sequelize=require("sequelize");

// const sequelize=require("../util/database");

// const group_members=sequelize.define('group_members',{
//     group_member_id:{
//         autoIncrement:true,
//         type:Sequelize.INTEGER,
//         allowNull:false,
//         primaryKey:true,
//     },
//     user_id:Sequelize.INTEGER,
//     group_id:Sequelize.INTEGER,
// })


// module.exports=group_members;



const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const User = require("./users");
const Group = require("./groups");

const GroupMembers = sequelize.define('group_members', {
    id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    // Define foreign key for user
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    // Define foreign key for group
    groupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Group,
            key: 'id'
        }
    }
});

module.exports = GroupMembers;
