import mongoose from "mongoose";


export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    role: string;
    isActive: boolean;
}


const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, required: true, default: "USER" }, 
        isActive: { type: Boolean, required: true, default: true }, 
    },
    { timestamps: true }
);


export default mongoose.model<IUser>("User", UserSchema);
