const express=require('express');

const body_parser=require('body-parser');

const cors=require('cors');

const sequelize=require('./util/database');

require('dotenv').config();
//routers 
const admin=require('./routes/admin');

const message=require('./routes/messages');

const app=express();

app.use(cors());

app.use(body_parser.json());

app.use(admin);

app.use(message);

const port=process.env.PORT || 3000;

sequelize.sync().then(()=>{
    app.listen(port,console.log(`Group Chat App listening on ${port}`));
}).catch(err=>{
    console.log(err);
})
