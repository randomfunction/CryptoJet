
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Profile = require('./profile');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true 
    },
    username: {
        type: String,
        required: true,
        unique: true 
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile' 
    }
}, { collection: 'users' });

const User = mongoose.model('User', userSchema);

mongoose.connect('mongodb://localhost:27017/cryptojet', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User does not have an account.' });
        }
        if(password!==user.password){throw "" }
        res.status(200).json({user: user, message: 'Login successful.' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal server error');
    }
});


app.post('/signup', async (req, res) => {
    const { email, username, password } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Email or username is already taken.' });
        }
        const newUser = new User({ email, username, password });
        await newUser.save();

        const newProfile = new Profile({
            user: newUser._id,
            bio: 'Welcome to my profile!',
            profilePicture: 'default.jpg', //not working
            socialMediaLinks : {
                facebook: '',
                instagram: '',
                twitter: '',
                youtube: '',
                linkedin: '',
                }
        });
        await newProfile.save();


        res.status(200).json({ newProfile, message: 'Account created successfully' });

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Internal server error');
    }
});

// app.post('/updateBio', async (req, res) => {
//     const { userId, newBio } = req.body;
//     try {
//         // Find the user's profile by user ID
//         const profile = await Profile.findOne({ user: userId });
//         if (!profile) {
//             return res.status(404).json({ message: 'Profile not found' });
//         }
//         // Update the bio
//         profile.bio = newBio;
//         // Save the updated profile to the database
//         await profile.save();
//         res.status(200).json({ message: 'Bio updated successfully' });
//     } catch (error) {
//         console.error('Error updating bio:', error);
//         res.status(500).send('Internal server error');
//     }
// });

// /// Define route to update profile picture
// app.post('/updateProfilePicture', async (req, res) => {
//     const { userId, newProfilePicture } = req.body;
//     console.log('Received request to update profile picture:', userId, newProfilePicture); // Add this line for debugging
//     try {
//         // Find the user's profile by user ID
//         const profile = await Profile.findOne({ user: userId });
//         if (!profile) {
//             return res.status(404).json({ message: 'Profile not found' });
//         }
//         // Update the profile picture
//         profile.profilePicture = newProfilePicture;
//         // Save the updated profile to the database
//         await profile.save();
//         console.log('Profile picture updated successfully'); // Add this line for debugging
//         res.status(200).json({ message: 'Profile picture updated successfully' });
//     } catch (error) {
//         console.error('Error updating profile picture:', error);
//         res.status(500).send('Internal server error');
//     }
// });



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});