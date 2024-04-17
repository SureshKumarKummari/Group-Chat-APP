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


io.on('connection', (socket) => {
 
 console.log('New client connected', socket.handshake.query.userid);

    // Joining the room based on the user ID
    socket.join(socket.handshake.query.userid);

    // Handling message event
    socket.on('message', async ({ senderid, receiverid, message }) => {
        console.log('Received message:', { senderid, receiverid, message });
        try {
            // Store the message in the database
            const newMessage = await messages.create({
                senderId: Number(senderid),
                receiverId: Number(receiverid),
                content: message
            });

            // Emit the message to the receiver's room
            io.to(receiverid).emit('message', message);
        } catch (error) {
            console.error('Error storing message:', error);
            // Handle error, if any
        }
    });




  //live typing
// socket.on('typing', () => {
//   console.log("User started typing");
//   socket.broadcast.emit('user typing', socket.id);
// });

// socket.on('stop typing', () => {
//   console.log("User stopped typing!");
//   socket.broadcast.emit('user stopped typing', socket.id);
// });

//sending users and groups info
  socket.on('getusersdata', async (id) => {
    try {
        const userData = await users.findAll({
            attributes: ['user_id', 'username']
          });

          const userId = id; // Example userId
          group_members.findAll({
                 where: { userId }, // Find all group members where userId matches
                attributes: ['groupId']
              }).then(groupMembers => {
                const groupIds = groupMembers.map(groupMember => groupMember.groupId); 
                return groups.findAll({
                where: { id: groupIds }, // Find all groups where id matches the groupIds
                //attributes: ['id', 'name', 'adminId'] // Select specific attributes of groups
                attributes: [
                  ['id', 'user_id'],    // Alias 'user_id' for 'id'
                  ['name', 'user_name'], // Alias 'user_name' for 'name'
                  'adminId']
              });
          }).then(groupData => {
        // console.log(groupData);
        // Send the retrieved user and group data to the client
        console.log(groupData);
        socket.emit('usersdata', { users: userData,groups: groupData });
       });
    } catch (error) {
        console.error('Error fetching user and group data:', error);
        // Handle error, if any
    }
});


//getting previous messages

socket.on('getcurrentchat', async ({ receiverid, userid }) => {
    try {
        // Fetch messages exchanged between the specified users
        const chatMessages = await messages.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { senderId: userid, receiverId: receiverid },
                    { senderId: receiverid, receiverId: userid }
                ]
            },
            order: [['createdAt', 'ASC']], 
         });


         let finalchat=chatMessages.map(message=>{return message.dataValues});
        // Emit the formatted messages to the client
        socket.emit('currentchat', chatMessages);
    } catch (error) {
        console.error('Error fetching chat messages:', error);
        // Handle error, if any
    }
});





socket.on('getallusers', async (data) => {
    try {
        // Fetch all users from the database
        const allUsers = await users.findAll({
            attributes: ['user_id', 'username'] // Select only the user_id and username fields
        });

        // Send the list of users to the client
        socket.emit('allusers', allUsers);
    } catch (error) {
        console.error('Error fetching all users:', error);
        // Handle the error
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
