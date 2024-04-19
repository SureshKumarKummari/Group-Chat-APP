const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const User = require("./users");

const new_admins = sequelize.define('new_admins', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    group_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    // Define foreign key for group admin
    adminId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id'
        }
    }
});

module.exports = new_admins;