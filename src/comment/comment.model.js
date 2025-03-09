import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, "El contenido es necesario"]
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario', 
        required: true 
    },
    publication: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Publicacion', 
        required: true 
    },
    state: {
        type: Boolean,
        default: true
    }
}, 
{
    timestamps: true,  
    versionKey: false   
});

export default mongoose.model("Comentario", CommentSchema);