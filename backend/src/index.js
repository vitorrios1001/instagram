const express = require('express');
const mongoose = require('mongoose');
//const path = require('path');
const cors = require('cors');
const app = express();

//const keys = require('./config/keys')

const port = process.env.PORT || '4000';

const server = require('http').Server(app);
const io = require('socket.io')(server);

mongoose.connect(process.env.CONNECTIONSTRING || keys.connectionString, {
    useNewUrlParser: true
})

app.use((req, res, next) => {
    req.io = io;

    next();
});

app.use(cors());

//app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads', 'resized')));

app.use(require('./routes'));

//app.listen(port)

server.listen(port);