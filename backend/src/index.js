const express = require('express');
const mongoose = require('mongoose');
//const path = require('path');
const cors = require('cors');
const app = express();

const keys = require('./config/keys')

const port = process.env.PORT || '4000';

const server = require('http').Server(app);
const io = require('socket.io')(server);

mongoose.connect(process.env.CONNECTIONSTRING || keys.connectionString, {
    useNewUrlParser: true
})

var allowedOrigins = ['http://localhost:3000',
    'https://cloneapp-instagram.web.app',
    'https://cloneapp-instagram.firebaseapp.com'
];

app.use((req, res, next) => {
    req.io = io;

    next();
});

app.use(cors())
/*
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return (null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';

            return callback(new Error(msg), false);
        }

        return callback(null, true);
    }
}));
*/
//app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads', 'resized')));

app.use(require('./routes'));

//app.listen(port)

server.listen(port);