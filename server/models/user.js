const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    bio: { type: String, default: 'hello! i\'m a new to chatti. let\'s chat', trim: true },
    showEmail: { type: Boolean, default: false },
    private: { type: Boolean, default: false },
    url: { type: String, trim: true },
    gender: { type: String },
    birthday: { type: Number },
    avatar: {
        type: String,
        required: true,
        default: 'https://i.imgur.com/tS4CS66.png',
    },
    followers: [{
        type: Schema.Types.ObjectId,
        ref: "user"
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: "user"
    }],
    blocked: [
        {
            type: Schema.Types.ObjectId,
            ref: "user"
        },
    ],
}, {
    timestamps: true,
});


userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {
    if (!this.isModified) {
        next();
    }
    const salt = await bcrypt.genSalt(15)
    this.password = await bcrypt.hash(this.password, salt)
})



const user = model('user', userSchema)
module.exports = user;