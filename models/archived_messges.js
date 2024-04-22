// archivedMessage.js (model for ArchivedChat table)
const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const ArchivedMessage = sequelize.define('archived_message', {
    id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    content: {
        type: Sequelize.STRING,
        allowNull: false
    },
    senderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    receiverId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    isGroup: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    Group_id:{
        type: Sequelize.INTEGER,
        defaultValue: 0,
    },
    ismedia:{
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    filename:{
        type: Sequelize.STRING,
        defaultValue: "null",
    },
    fileurl:{
        type: Sequelize.STRING,
        defaultValue: "null",
    }
});

module.exports = ArchivedMessage;
