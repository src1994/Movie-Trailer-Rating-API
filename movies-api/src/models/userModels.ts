import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
    name: string,
    email: string,
    password: string,
    role: string,
    isActive:  boolean
}

const UserSchema = new mongoose.Schema ({
    name: {type: String, require: true},
    email: {type: String, require: true},
    password: {type: String, require: true},
    role: {type: String, require: "USER"},
    isActive: {type: Boolean, require: true},

},
 {timestamps: true}
);

export default mongoose.model<IUser>("USER", UserSchema);