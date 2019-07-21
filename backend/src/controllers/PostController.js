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

    async remove(req, res) {
        var post = await Post.findById(req.params.id);

        try {

            const fileName = post.image.replace('https://firebasestorage.googleapis.com/v0/b/cloneapp-instagram.appspot.com/o/', '').replace('?alt=media', '')

            const bucket = storage().bucket('cloneapp-instagram.appspot.com');

            bucket.deleteFiles({
                prefix: fileName,
            }, function (err) {
                if (!err)
                    console.log("File removed success")
                else
                    console.log(err)
            })

        } catch (error) {
            console.log(error)
        }

        await post.remove();

        return res.send('Post removed');
    },

    async store(req, res) {
        const { author, place, description, hashtags } = req.body;
        const { file } = req;

        var fileName = '';

        console.log(file)
/*
        const readStream = fs.createReadStream(path.normalize(file.originalname))

        let transform = sharp();

        transform = transform.toFormat('jpg').resize(500, 500);

        console.log(readStream.pipe(transform))

        sharp(file)
            .resize(200)
            .toFile(resfile, (err, info) => {
                console.log(info)
                console.log(err)
            })*/
        /*
                await sharp( file)
                    .resize(500)            
                    .toFile(`resized-${file.originalname}`, data => {
                        console.log("data:" +data)
                    })
        */


        if (file) {

            try {
                const urlImage = await uploadImageToFirebase(file);

                fileName = urlImage;
            } catch (error) {
                console.error(error)
            }
        }

        if (!fileName)
            return res.status(500).send('Erro ao tentar fazer upload da imagem')

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



const uploadImageToFirebase = async (file) => {
    return new Promise((resolve, reject) => {

        if (!file) reject('No image file');
        console.log(file)
        let newFileName = `${Date.now()}_${file.originalname}`
        console.log(newFileName)

        const bucket = storage().bucket('cloneapp-instagram.appspot.com')

        let fileUpload = bucket.file(newFileName);

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

            const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileUpload.name}?alt=media`
            console.log(url)
            resolve(url);
        });

        blobStream.end(file.buffer);
    })
}

