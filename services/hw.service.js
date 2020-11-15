const mongoose = require('mongoose')
const hwModel = require('../models/hw.model')
const userModel = require('../models/userModel')

class HwService {

    createHw = async (req, adminId) => {
        const lesson = JSON.parse(req.lesson)
        console.log(lesson)
        await userModel.findOne({
            adminId: adminId
        }).then(async () => {
            await hwModel.create({
                themeType: lesson.themeType,
                cost: Number(lesson.cost),
                lessonName: lesson.name,
                themeName: lesson.theme,
                createDate: Date.now(),
                completeDate: lesson.completeDate,
                hwStatus: 'Pending'
            })
        });
    }

    hwSendToModerate = async (req) => {
        const user = JSON.parse(req.user)
        const theme = JSON.parse(req.theme)
        console.log(req)

        await hwModel.findOneAndUpdate(
            { _id: theme._id },
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
                                { _id: WhatUserComplete._id }
                            ]
                        },
                        {
                            status: 'Home work complete',
                            completeDate: Date.now()
                        }
                    )
            })
                .then(async () => {
                    await userModel.findByIdAndUpdate(
                        { _id: WhatUserComplete._id },
                        { $inc: { coins: + lesson.theme.coins } }
                        )
                });
        });


    }

    getAllHw = async () => {
        return {
            themes: await hwModel.find({
                hwStatus: 'Pending',
            })
        };
    }
}

module.exports = HwService