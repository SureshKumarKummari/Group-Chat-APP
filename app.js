const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const sequelize = require('./util/database');
const Sequelize=require('sequelize');
const users = require('./models/users');
const messages = require('./models/messages');
const groups = require('./models/groups');
const group_members = require('./models/group_members');
const links=require('./models/links');
const new_admins=require('./models/new_admins');

const path=require('path')

const auth=require('./middleware/userauthentication');

const uploadtoaws=require('./util/uploadingtoaws');

const cors=require('cors');

require('dotenv').config();

// Routers
const admin = require('./routes/admin');
const message = require('./routes/messages');


// cronJob for deleting lst 24 hrs messges
const cron = require('node-cron');
const ArchivedMessage = require('./models/archived_messges');


async function cronJobHandler(){
   console.log("In cron JOB!");
    try {
        // Get messages older than 1 day from the Chat table
        console.log("In cron JOB!");
        const oldMessages = await messages.findAll({
            where: {
                createdAt: {
                    [Sequelize.Op.lt]: new Date(new Date() - 24 * 60 * 60 * 1000)
                }
            }
        });

        // Move old messages to the ArchivedChat table
        for (const message of oldMessages) {
            await ArchivedMessage.create({
                content: message.content,
                senderId: message.senderId,
                receiverId: message.receiverId,
                isGroup: message.isGroup,
                Group_id: message.Group_id,
                ismedia: message.ismedia,
                filename: message.filename,
                fileurl: message.fileurl
            });
        }

        // Delete old messages from the Chat table
        await messages.destroy({
            where: {
                createdAt: {
                    [Sequelize.Op.lt]: new Date(new Date() - 24 * 60 * 60 * 1000)
                }
            }
        });

        console.log('Old messages moved to ArchivedChat table and deleted from Chat table.');
    } catch (error) {
        console.error('Error in cron job:', error);
    }

}



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

app.use(express.static(path.join(__dirname,'public')));

app.get('/',(req,res)=>{
   res.sendFile(path.join(__dirname,'views','signup.html'));
});

cron.schedule("0 0 * * *", cronJobHandler);

let connectedusers=[];

io.on('connection', (socket) => {
 
 console.log('New client connected', socket.handshake.query.userid);
    // Joining the room based on the user ID
    socket.join(socket.handshake.query.userid);
    connectedusers.push(socket.handshake.query.userid);

  socket.on('message', async ({ senderid, receiverid, message, isgroup, ismedia, fileName ,token}) => {
    try {
        await auth.authorize(token);
        // Store the message in the database
        //const
        let resultmessage = { message: message, receiverid: receiverid, isgroup: isgroup,senderid: senderid,isfile:false};
        //console.log(senderid, receiverid, message, isgroup, ismedia, fileName);
        if (!isgroup) {
            if (!ismedia) {
                const newMessage = await messages.create({
                    senderId: Number(senderid),
                    receiverId: Number(receiverid),
                    content: message
                });
            } else {
             // console.log(senderid, receiverid, message, isgroup, ismedia, fileName);
                const fileUrl = await uploadtoaws.uploadtoS3(message, fileName);
                await messages.create({
                    fileurl: fileUrl,
                    filename: fileName,
                    senderId: Number(senderid),
                    receiverId: Number(receiverid),
                    content: "File"
                });
                resultmessage.message=fileUrl;
                resultmessage.isfile=true;
            }

            // Emit the message to the receiver's room
            io.to(receiverid).emit('message', resultmessage);
        } else {
            if (!ismedia) {
                const newGroupMessage = await messages.create({
                    senderId: Number(senderid),
                    receiverId: Number(receiverid),
                    content: message,
                    isGroup: isgroup,
                    Group_id: Number(receiverid)
                });
            } else {
                const fileUrl = await uploadtoaws.uploadtoS3(message, fileName);
                await messages.create({
                    fileurl: fileUrl,
                    filename: fileName,
                    senderId: Number(senderid),
                    receiverId: Number(receiverid),
                    content: "File",
                    isGroup: isgroup,
                    Group_id: Number(receiverid)
                });
                resultmessage.message=fileUrl;
                resultmessage.isfile=true;
            }

            //socket.broadcast.emit("message", resultmessage);
            io.emit("message", resultmessage);
        }
    } catch (error) {
        console.error('Error storing message:', error);
        // Handle error, if any
    }
});


//sending users and groups info
  socket.on('getusersdata', async ({id,token}) => {
    try {
        await auth.authorize(token);
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
                  ['name', 'username']], // Alias 'user_name' for 'name'
                 // 'adminId']
              });
          }).then(groupData => {
        // console.log(groupData);
        // Send the retrieved user and group data to the client
        //console.log(groupData);
        socket.emit('usersdata', { users: userData,groups: groupData });
       });
    } catch (error) {
        console.error('Error fetching user and group data:', error);
        // Handle error, if any
    }
});


//getting previous messages

socket.on('getcurrentchat', async ({ receiverid, userid,isgroup,token }) => {
    try {
        await auth.authorize(token);
        // Fetch messages exchanged between the specified users
        let chatMessages;
        //console.log(isgroup);
        if(!isgroup){
          chatMessages = await messages.findAll({
              where: {
                    [Sequelize.Op.and]: [{
                      [Sequelize.Op.or]: [{ senderId: userid, receiverId: receiverid },{ senderId: receiverid, receiverId: userid }]
                      },{isGroup: false}
                    ]},
              order: [['createdAt', 'ASC']], 
          });

        }else{
        //console.log("i am in group query");
        chatMessages = await messages.findAll({
              where: {Group_id:receiverid,isGroup:true,
              },
              order: [['createdAt', 'ASC']], 
          });

        }
        //console.log(chatMessages);
         //let finalchat=chatMessages.map(message=>{return message.dataValues});
        // Emit the formatted messages to the client
        //console.log(chatMessages);
        socket.emit('currentchat', chatMessages);
    } catch (error) {
        console.error('Error fetching chat messages:', error);
        // Handle error, if any
    }
});



//To get all users
socket.on('getallusers', async ({data,token}) => {
    try {
        await auth.authorize(token);
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


//To get links to join group
socket.on('getlinkstojoin',async({userid,token})=>{

  try {
      await auth.authorize(token);
        const groupids = await links.findAll({
            attributes: ['group_id'],
            where:{'userid':userid},
        });
        const groupIdsArray = groupids.map(item => item.group_id);

// Now use the extracted group IDs in the where clause of the second query
        const linkstojoin = await groups.findAll({
            attributes: [['id', 'group_id'], ['name', 'group_name']],
            where: {
              id: groupIdsArray
            } 
        });
        //console.log(linkstojoin);
        // Send the list of users to the client
        socket.emit('linkstojoin',linkstojoin);
    } catch (error) {
        console.error('Error fetching all links', error);
    }



});


 socket.on('addtogroup',async({groupid,token})=>{
  //console.log(groupId);
  await auth.authorize(token);

  let user=socket.handshake.query.userid;
  await group_members.create({userId:user, groupId:groupid});

  const link=await links.findOne({where:{userid:user,group_id:groupid}})
  link.destroy();
  //userid,group_id

  socket.emit('okaddgroup',groupid);


 });






socket.on("creategroup",async({groupName,selectedUsers,selectedUserIds,token})=>{
 // console.log(connecteduserid,groupName,selectedUsers,selectedUserIds);
 try{
  await auth.authorize(token);
 let connecteduserid=Number(socket.handshake.query.userid);
  const group = await groups.create({
    name: groupName,
    //adminId: connecteduserid
  });
  let gid=Number(group.id);
  const GroupMember =await  group_members.create({
      userId: connecteduserid,
      groupId: gid
    });
    const admin=await new_admins.create({
      group_id:gid,
      adminId:connecteduserid,
    })
    //new_admins -group_id adminId
    //const creatinglinks=links.bulkCreate({})
    const selectedUserIdsExcludingConnected = selectedUserIds.filter(id => Number(id) != connecteduserid);
    //console.log(selectedUserIdsExcludingConnected,gid);
    
    //For sending invitatons to join group members
    // const createdlinks=await links.bulkCreate(selectedUserIdsExcludingConnected.map(userId => ({
    //   userid:Number(userId),
    //   group_id: gid
    // })));

    //For adding group members directly to the group
    const adding_group_members=await group_members.bulkCreate(selectedUserIdsExcludingConnected.map(userId => ({
       userId:Number(userId),
       groupId: gid
     })));

    let data={user_id:gid,username:groupName} ;
    socket.emit('groupcreated',(data));
  }
  catch(err){
    console.log("Cannot create Group",err);
  }
})


socket.on("getgroupmembers",async({groupid,token})=>{
  try{
    await auth.authorize(token);
   // console.log(groupid);
    let all=await group_members.findAll({
                  attributes:['userId'],where:{groupId:groupid}});
    let admins=await new_admins.findAll({attributes:['adminId'],where:{group_id:groupid}});

          //console.log(all,admins);

           const memberIds = all.map(member => member.userId);
            const adminIds = new Set(admins.map(admin => admin.adminId));

         // console.log(memberIds, adminIds);
          all=memberIds.map((id)=>{
                if(adminIds.has(id)){
                  return {user_id:id,isadmin:true}
                }else{
                  return {user_id:id,isadmin:false}
                }
          })

         // console.log(all);

        let allgroupmembers = await Promise.all(all.map(async (row) => {
            const usernameQuery = await users.findOne({
                where: { user_id: row.user_id },
                attributes: ['username'],
            });
            return { username: usernameQuery.username, user_id: row.user_id,isadmin:row.isadmin };
          }));


       // console.log(allgroupmembers);
          socket.emit('allgroupmembers', allgroupmembers);

  }catch(err){
    console.log("Cannot get group members",err);
  }

});




socket.on("removeuser",async({id,group_id,token})=>{

  try{
    await auth.authorize(token);
    let user=await group_members.findOne({where:{userId:id,groupId:group_id}});
     if(user){
          user.destroy();
          console.log("user deleted successully");
    }else{
      throw err;
    }
  }catch(err){
      console.log("Cannot delete user ",err);
  }

});



socket.on("makeadmin",async({id,group_id,token})=>{

  try{
    await auth.authorize(token);

    let admin=await new_admins.create({group_id:group_id,adminId:id});
    if(admin){
    console.log("Admin created successully");
    }else{
      throw err;
    }
  }catch(err){
      console.log("Cannot delete user ",err);
  }



});



 socket.on("isadmin",async({userid,groupid,token})=>{
      try{
        await auth.authorize(token);

       // console.log(groupid,userid);
        let admin=await new_admins.findOne({where:{adminId:userid,group_id:groupid}})
        if(admin){
        socket.emit('okcheck',true);
        }else{
          socket.emit('okcheck',false);
        }
      }catch(err){
        console.log("Something went Wrong!",err);
      }
  });



});



group_members.belongsTo(new_admins, { foreignKey: 'group_id' });
new_admins.hasMany(group_members, { foreignKey: 'groupId' });



// Start the server
const PORT = process.env.PORT ||3000;


sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    //cronjob();
  });
}).catch(err => {
  console.log(err);
});
