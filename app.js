const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const sequelize = require('./util/database');
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

users.belongsToMany(groups, { through: group_members, foreignKey: 'user_id' });
groups.belongsToMany(users, { through: group_members, foreignKey: 'group_id' });




io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('message', (data) => {
    console.log('Received message:', data);
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

socket.on('typing', () => {
  console.log("User started typing");
  socket.broadcast.emit('user typing', socket.id);
});

socket.on('stop typing', () => {
  console.log("User stopped typing!");
  socket.broadcast.emit('user stopped typing', socket.id);
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
