const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const Group = require("./groups");

const Message = sequelize.define('messages', {
    message_id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    user_id: Sequelize.INTEGER,
    message: Sequelize.STRING,
    group_id: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
         /*references: {
             model: Group,
             key: 'group_id'
         }*/
    }
});

module.exports = Message;

