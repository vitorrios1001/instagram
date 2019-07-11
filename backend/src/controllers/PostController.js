const Post = require('../models/Post');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const { storage } = require('../config/firebase')

module.exports = {

    async index(req, res) {
        var posts = await Post.find().sort('-createdAt');

        return res.json(posts);
    },

    async store(req, res) {
        const { author, place, description, hashtags } = req.body;
        const { originalname: image } = req.file;
console.log(req.file)
        const [name] = image.split('.');

        const fileName = `${name}.png`;
   
        let file = req.file;

        if (file) {
            uploadImageToFirebase(file).then((success) => {
                console.log(success)
            }).catch((error) => {
                console.error(error);
            });
        }
/*
        await sharp(req.file.path)
            .resize(500)
            .jpeg({ quality: 70 })
            .toFile(path.resolve(req.file.destination, 'resized', fileName))

        fs.unlinkSync(req.file.path)
*/
        const post = await Post.create({
            author,
            place,
            description,
            hashtags,
            image: fileName
        })

        req.io.emit('post', post);

        return res.json(post);
    }
};



const uploadImageToFirebase = (file) => {
    return new Promise((resolve, reject) => {

        if (!file) reject('No image file');
        console.log(file)
        let newFileName = `${Date.now()}_${file.originalname}`
        console.log(newFileName)

        const bucket = storage().bucket('cloneapp-instagram.appspot.com')

        let fileUpload = bucket.file(newFileName);
        //storage().bucket('cloneapp-instagram.appspot.com').upload(file.path)

        console.log(fileUpload.name)

        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });

        blobStream.on('error', (error) => {
            reject('Something is wrong! Unable to upload at the moment.' + error);
        })

        blobStream.on('finish', () => {
            // The public URL can be used to directly access the file via HTTP.
            
            const url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`
            console.log(url)
            resolve(url);
        });

        blobStream.end(file.buffer);
    })
}

