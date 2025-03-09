import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: [true, "El nombre de usuario es necesario"]
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        minLength: 8,
        maxLength: 8,
        required: true
    },
    role: {
        type: String,
        enum: ["ADMIN_ROLE","USER_ROLE"],
        default: "USER_ROLE"
    },
    state: {
        type: Boolean,
        default: true
    }
});

UserSchema.methods.toJSON = function() {
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
};

export default mongoose.model("Usuario", UserSchema);