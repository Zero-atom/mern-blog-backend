import mongoose from "mongoose";

const UserSchema= new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    avatarUrl: String,//если не обязательное поле
}, 
{
    timestamps: true,//создание и обновления
},
);

export default mongoose.model('User', UserSchema);