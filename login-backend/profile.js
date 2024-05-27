const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    bio: String,
    profilePicture: String,
    socialMediaLinks: {
        type: [
            {
                platform: String,
                url: String
            }
        ]
    }
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;