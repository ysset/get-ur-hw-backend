const express = require('express');
const app = express.Router();

const multer = require("multer")
const FilesService = require('../services/files.service')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({
    dest: 'uploads/',
    storage: storage
})

const filesService = new FilesService()

/* GET home page. */
app.post('/upload', upload.single('hw', 'user'), async (req, res, next) => {
    console.log(req.file)
    console.log(req.body.user)
    await filesService.saveHw(req)
        .then(() => {res.send({
            status: 200,
            massage: 'Ожидайте проверки работы.'
        })})
        .catch(err => {
            throw err
        })
});

module.exports = app;
