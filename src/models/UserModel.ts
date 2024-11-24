import mongoose, { Schema } from "mongoose";
import UserDetails from "../interfaces/UserDetails";

const userSchema = new Schema<UserDetails>(
    {
        nic: {
            type: String,
            required: true,
        }, username: {//bus number
            type: String,
            required: true,
            unique: true
        }, firstName: {
            type: String,
            required: true,
            trim: true
        }, lastName: {
            type: String,
            required: true,
            trim: true
        }, mobile: {
            type: String,
            required: true,
            unique: true
        }, password: {
            type: String,
            required: true
        },accType:{
            type:String,
            enum: ['General', 'Admin'], default: 'General'
        }
    },
    {
        timestamps: true,
    }
)

const UserModel=mongoose.model<UserDetails>('User',userSchema)

export default UserModel