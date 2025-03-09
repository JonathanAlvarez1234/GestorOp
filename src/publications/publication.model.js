import mongoose from "mongoose";

const PublicationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: [true, "El contenido es necesario"]
    },
    creator: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario', 
        required: true },
    category: {  
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Categoria',  
        required: true 
    },
    comments: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Comentario' 
    }],
    state: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,  
    versionKey: false   
});

export default mongoose.model("Publicacion", PublicationSchema);

