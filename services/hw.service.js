const mongoose = require('mongoose')
const hwModel = require('../models/hw.model')
const userModel = require('../models/userModel')

class HwService {

    createHw = async (req, adminId) => {
        console.log(req)
        await userModel.findOne({
            adminId: adminId
        }).then(async () => {
            await hwModel.create({
                lessonName: req.lesson.name,
                themeName: req.lesson.theme,
                createDate: Date.now(),
                completeDate: req.lesson.completeDate,
                hwStatus: 'Pending'
            })
        });
    }

    hwSendToModerate = async (req) => {
        const user = JSON.parse(req.user)
        const theme = JSON.parse(req.theme)
        console.log(req)

        await hwModel.findOneAndUpdate(
            {_id: theme._id},
            {
                $push: {
                    users: [
                        {
                            _id: user._id,
                            username: user.username,
                            hwPath: req.path,
                            status: 'Pending',
                            uploadDate: Date.now()
                        }
                    ]
                }
            })
            .catch(err => {
                throw err
            })
    }

    hwSetComplete = async (req, adminId) => {
        const WhatUserComplete = JSON.parse(req.user)
        const lesson = JSON.parse(req.lesson)

        await userModel.findOne({
            adminId: adminId
        }).then(async () => {
            await hwModel.findOneAndUpdate(
                {
                    lessonName: lesson.Lesson.lessonName,
                    themeName: lesson.theme,
                },
                {
                    completeDate: Date.now(),
                    hwStatus: 'Complete',
                    hwPAth: WhatUserComplete.hwPath
                }).then(async () => {
                    await hwModel.findOne(
                        {
                            users: [
                                {
                                    userName: WhatUserComplete.username
                                }
                            ]
                        },
                        {
                            status: 'Home work complete',
                            completeDate: Date.now()
                        }
                    )
            });
        });


    }

    getAllHwTheme = async () => {
        return {
            themes: await hwModel.find({
                hwStatus: 'Pending',
            })
        };
    }
}

module.exports = HwService