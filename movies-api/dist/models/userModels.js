import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    name: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    role: { type: String, require: "USER" },
    isActive: { type: Boolean, require: true },
}, { timestamps: true });
export default mongoose.model("USER", UserSchema);
