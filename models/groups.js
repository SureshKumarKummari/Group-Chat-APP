const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const User = require("./users");

const Group = sequelize.define('group', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    // Define foreign key for group admin
    // adminId: {
    //     type: Sequelize.INTEGER,
    //     allowNull: false,
    //     references: {
    //         model: User,
    //         key: 'user_id'
    //     }
    // }
});

module.exports = Group;
