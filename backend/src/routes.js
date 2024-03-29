const express = require('express');
const multer = require('multer');
const uploadConfig = require('./config/upload');

const PostController = require('./controllers/PostController');
const LikeController = require('./controllers/LikeController');

const routes = new express.Router();
const upload = multer(uploadConfig);

routes.post('/posts', upload.single('image'), PostController.store);
routes.get('/posts', PostController.index);
routes.delete('/posts/:id', PostController.remove);

routes.get('/', (req, res) => {
    return res.send('API rodando: Instagram-Clone')
})

routes.post('/posts/:id/like', LikeController.store);

module.exports = routes;