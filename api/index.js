const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Message = require('./models/Message');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const ws = require('ws');

dotenv.config();
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
    });
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

const app = express();

app.get('/api/test', (req, res) => {
    res.json('test ok');

});
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

async function getUserDataFromRequest(req){
    return new Promise((resolve,reject)=>{
        const token = req.cookies?.token;
        if (token) {
            jwt.verify(token, jwtSecret, {}, (err, userData) => {
                if (err) throw err;
               resolve(userData);
            })
        }
        else{
            reject('no token');
        }
    });
   
}
app.get('/api/messages/:userId',async(req,res)=>{
    const {userId}=req.params;
    const userData=await getUserDataFromRequest(req);
    const ourUserId=userData.userId;
    const messages=  await Message.find({
        sender:{$in:[userId,ourUserId]},
        recipient:{$in:[userId,ourUserId]},
    }).sort({createdAt:1});
    res.json(messages);
});
app.get('/api/profile', (req, res) => {
    const token = req.cookies?.token;
    if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
            if (err) throw err;
            res.json(userData);
        })
    }
    else {
        res.status(401).json('no token');
    }
})

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await User.findOne({ username });
    if (foundUser) {
        const isCorrectPassword = bcrypt.compareSync(password, foundUser.password);
        if (isCorrectPassword) {
            jwt.sign({ userId: foundUser._id, username }, jwtSecret, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).status(201).json({
                    id: foundUser._id
                })
            })
        }
    }
})

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
        const createdUser = await User.create({
            username,
            password: hashedPassword
        });
        jwt.sign({ userId: createdUser._id, username }, jwtSecret, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).status(201).json({
                id: createdUser._id
            })
        })
    } catch (err) {
        if (err) throw err;
        res.status(500).json("error");
    }

});

const server = app.listen(4000);


const wss = new ws.Server({ server });
wss.on('connection', (connection, req) => {
    console.log('WebSocket connection established');
    const cookies = req.headers.cookie;
    if (cookies) {
        const tokenCookieString = cookies.split(';').find(str => str.includes('token='))
        if (tokenCookieString) {
            const token = tokenCookieString.split('=')[1];
            if (token) {
                jwt.verify(token, jwtSecret, {}, (err, userData) => {
                    if (err) throw err;
                    const { userId, username } = userData;
                    connection.userId = userId;
                    connection.username = username;
                })
            }
        }
    }

    connection.on('message', async (message) => {
        const messageData = JSON.parse(message.toString());
        const { recipient, text } = messageData.message;
        if (recipient && text) {
            const messageDoc = await Message.create({
                sender: connection.userId,
                recipient,
                text
            });
            [...wss.clients].filter(c => c.userId === recipient)
                .forEach(c => c.send(
                    JSON.stringify({
                        text,
                        sender: connection.userId,
                        recipient,
                        _id: messageDoc._id
                    })));
        }
    });

    connection.on('open', () => {
        console.log('WebSocket connection opened');
    });

    connection.on('close', () => {
        console.log('WebSocket connection closed');
    });

    connection.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
    //n
    //notify about online user
    [...wss.clients].forEach(client => {
        client.send(JSON.stringify({
            online: [...wss.clients].map(c => ({ userId: c.userId, username: c.username }))
        }))
    })
})