import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
    role: {
        type: String,
        required: [true, "The role is required"]
    }
});

export default mongoose.model("Role", RoleSchema);


