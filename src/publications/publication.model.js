import mongoose from "mongoose";

const PublicationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "The title is required"]
    },
    content: {
        type: String,
        required: [true, "The content is required"]
    },
    creator: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true },
    category: {  
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category',  
        required: true 
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,  
    versionKey: false   
});

export default mongoose.model("Publication", PublicationSchema);

