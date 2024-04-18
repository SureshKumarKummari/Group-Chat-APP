const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const User = require("./users");
const Group = require("./groups");

const Message = sequelize.define('message', {
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
    // Define foreign key for sender (user who sent the message)
    senderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    // Define foreign key for receiver (user or group who received the message)
    receiverId: {
        type: Sequelize.INTEGER,
        allowNull: false,},
    //     references: {
    //         model: Sequelize.literal('User.user_id OR Group.id'), // Define a literal to allow referencing either users or groups
    //         key: 'id'
    //     }
    // },
    // Define a boolean field to indicate whether the receiver is a user or a group
    isGroup: {
        type: Sequelize.BOOLEAN,
        //allowNull: false,
        defaultValue: false // Default to false (receiver is a user)
    },
    Group_id:{
        type: Sequelize.INTEGER,
        defaultValue: 0,
    }
});

Message.belongsTo(User, { foreignKey: 'receiverId', constraints: false, as: 'userReceiver' });
Message.belongsTo(Group, { foreignKey: 'receiverId', constraints: false, as: 'groupReceiver' });

module.exports = Message;
