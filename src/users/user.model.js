import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "The name is required"]
    },
    surname: {
        type: String,
        required: [true, "The surname is required"]
    },
    username: {
        type: String,
        required: [true, "The username is required"]
    },
    email:{
        type: String,
        required: [true, "The email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "The password is required"]
    },
    phone: {
        type: String,
        minLength: 8,
        maxLength: 8,
        required: [true, "The phone is required"]
    },
    role: {
        type: String,
        enum: ["ADMIN_ROLE","USER_ROLE"],
        default: "USER_ROLE"
    },
    status: {
        type: Boolean,
        default: true
    }
});

UserSchema.methods.toJSON = function() {
    const {__v,password, _id, ...usuario} = this.toObject();
    usuario.uid = _id;
    return usuario;
}

export default mongoose.model("User", UserSchema);