const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const sequelize = require('./util/database');
const Sequelize=require('sequelize');
const users = require('./models/users');
const messages = require('./models/messages');
const groups = require('./models/groups');
const group_members = require('./models/group_members');

const auth=require('./middleware/userauthentication');

const cors=require('cors');

require('dotenv').config();

// Routers
const admin = require('./routes/admin');
const message = require('./routes/messages');

const app = express();

app.use(cors())

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
  },
});

app.use(express.json());
app.use(admin);
app.use(message);

//users.belongsToMany(groups, { through: group_members, foreignKey: 'user_id' });
//groups.belongsToMany(users, { through: group_members, foreignKey: 'group_id' });




io.on('connection', (socket) => {
  console.log('New client connected');


  //getting and sending message
  socket.on('message', (data) => {
    console.log('Received message:', data);
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });


  //live typing
socket.on('typing', () => {
  console.log("User started typing");
  socket.broadcast.emit('user typing', socket.id);
});

socket.on('stop typing', () => {
  console.log("User stopped typing!");
  socket.broadcast.emit('user stopped typing', socket.id);
});

//sending users and groups info
  socket.on('getusersdata', async (id) => {
    try {
        // Find all distinct user IDs where the given user has sent or received a message
        const userMessageIds = await messages.findAll({
            attributes: ['senderId', 'receiverId'],
            where: {
                [Sequelize.Op.or]: [{ senderId: id }, { receiverId: id }]
            },
            raw: true
        });

        // Extract unique user IDs
        const userIds = [...new Set(userMessageIds.map(message => message.senderId).concat(userMessageIds.map(message => message.receiverId)))];

        // Find user details for the retrieved user IDs
        const userData = await users.findAll({
            //where: { user_id: userIds },
            attributes: ['user_id', 'username']
        });

        // Find all distinct group IDs where the given user has sent or received a message
       /* const groupMessageIds = await messages.findAll({
            attributes: ['groupId'],
            where: {
                [Sequelize.Op.or]: [{ senderId: id, receiverType: 'group' }, { receiverId: id, receiverType: 'group' }]
            },
            raw: true
        });

        // Extract unique group IDs
        const groupIds = [...new Set(groupMessageIds.map(message => message.groupId))];

        // Find group details for the retrieved group IDs
        const groupData = await groups.findAll({
            where: { group_id: groupIds },
            attributes: ['group_id', 'group_name']
        });
*/
        // Send the retrieved user and group data to the client
        socket.emit('usersdata', { users: userData });
    } catch (error) {
        console.error('Error fetching user and group data:', error);
        // Handle error, if any
    }
});


});






// Start the server
const PORT = process.env.PORT ||3000;

sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.log(err);
});
