const userModel = require('../models/userModel')

class UserService {

    getAllUsers = async (adminId) => {
        await userModel.findOne({
            adminId: adminId
        }).catch(err => {
            throw err
        })
        return {
            users: await userModel.find({})
        }
    }
}

module.exports = UserService;