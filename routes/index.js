const express = require('express');
const app = express.Router();

const multer = require("multer")
const FilesService = require('../services/hw.service')

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
app.post('/upload', upload.single('hw', 'theme', 'user'), async (req, res, next) => {
    console.log(req.file)
    console.log(req.body.theme)
    console.log(req.body.user)
    const {hwPath} = req.body
    req.body.path = req.file.path
    await filesService.hwSendToModerate(req.body)
        // .then(() => {res.send({
        //     status: 200,
        //     massage: 'Ожидайте проверки работы.'
        // })})
        .catch(err => {
            res.send({
                status: 505,
                massage: err
            })
            throw err
        })
    res.send({
        status: 200,
        massage: 'Ожидайте проверки работы.'
    })
});

app.post('/newHw:AdminId', async (req, res) => {
    console.log(req.body)
    await filesService.createHw(req.body, req.params.adminId)
        .then(res.send({complete: true}))
})

app.get('/getHw', async (req,res) => {
    res.send(await filesService.getAllHwTheme())
})

app.post('/setHwComplete', async (req, res) =>{
    await filesService.hwSetComplete()
        .then(res.send({complete: true}))
        .catch(err => {
            throw err
        })
})

module.exports = app;
