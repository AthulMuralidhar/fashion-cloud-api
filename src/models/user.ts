import mongoose from 'mongoose';

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
        }
    },
    { timestamps: true },
);

const UserModel = mongoose.model('User', userSchema);


export default UserModel;