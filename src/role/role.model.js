import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
    role: {
        type: String,
        required: [true, "El rol es necesario"]
    }
});

export default mongoose.model("Role", RoleSchema);


