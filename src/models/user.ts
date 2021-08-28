import mongoose from 'mongoose';

const TTL_SECS = Number(process.env.TTL_SECS) ?? 60
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
        },
        email:{
            type: String
        },
        extraInfo:{
            type: String
        },
        createdAt: { type: Date, default: Date.now }
    },
    { timestamps: true },
);
userSchema.index({ createdAt: 1 }, { expireAfterSeconds: TTL_SECS });
const UserModel = mongoose.model('User', userSchema);


export default UserModel;