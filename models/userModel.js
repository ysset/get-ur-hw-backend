const mongoose = require("mongoose")

const schema = mongoose.Schema({
    displayName: String,
    name: {
        familyName: String,
        givenName: String
    },
    coins: Number,
    adminId: String,
    status: String,
    gender: String,
    username: String,
    password: String,
    vkontakteId: String,
    registrationDate: String,
}, {collection: 'Users'})

schema.statics.findOneOrCreate = function findOneOrCreate(profile) {
    const self = this;
    return new Promise((resolve, reject) => {
        return self.findOne({vkontakteId: profile.id})
            .then((result) => {
                if (result) {
                    return resolve(result);
                }
                return self.create({
                    displayName: profile.displayName,
                    vkontakteId: profile.id,
                    username: profile.username,
                    name: {
                        familyName: profile.name.familyName,
                        givenName: profile.name.givenName
                    },
                    gender: profile.gender,
                    registrationDate: Date.now()
                })
                    .then((result) => {
                        return resolve(result);
                    }).catch((error) => {
                        return reject(error);
                    })
            }).catch((error) => {
                return reject(error);
            })
    });
};

module.exports = mongoose.model("userModel", schema)
