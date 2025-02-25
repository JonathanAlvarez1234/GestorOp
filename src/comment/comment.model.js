import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, "The content is required"]
    },
    creatorCrUser: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true },
    creatorCrPost: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Post', 
        required: true },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,  
    versionKey: false   
});

export default mongoose.model("Comment", CommentSchema);