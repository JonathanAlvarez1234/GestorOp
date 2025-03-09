import Usuario from "../users/user.model.js";
import Publicacion from "../publications/publication.model.js";
import Comentario from "../comment/comment.model.js";

export const saveComment = async (req, res) => {
    try {
        const { email, publicationId, content } = req.body;
        const user = await Usuario.findOne({ email });
        const publication = await Publicacion.findById(publicationId);
        if (!user) {
            return res.status(400).json({ 
                success: false, 
                msg: "Usuario no encontrado" 
            });
        }
        if (!publication) {
            return res.status(400).json({ 
                success: false, 
                msg: "Publicacion no encontrada" 
            });
        }
        const comment = new Comentario({
            content,
            author: user._id,
            publication: publication._id,
            state: true
        });

        await comment.save();
        await Publicacion.findByIdAndUpdate(publicationId, { 
            $push: { comments: comment._id } 
        });
        res.status(200).json({
            success: true,
            msg: "Comentario creado exitosamente",
            comment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            msg: "Error al guardar el comentario", 
            error 
        });
    }
};

export const getComments = async (req, res) => {
    const { limite = 10, desde = 0 } = req.query;
    const query = { state: true };
    try {
        const comments = await Comentario.find(query)
            .populate("author", "name")
            .populate("publication", "title")
            .skip(Number(desde))
            .limit(Number(limite));

        const total = await Comentario.countDocuments(query);
        res.status(200).json({
            success: true,
            total,
            comments
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            msg: "Error al obtener los comentarios", 
            error 
        });
    }
};

export const searchComment = async (req, res) => {
    const { id } = req.params;
    try {
        const comment = await Comentario.findById(id);
        if (!comment) {
            return res.status(404).json({ success: false, msg: "Comentario no encontrado" });
        }
        const owner = await Usuario.findById(comment.author);
        res.status(200).json({
            success: true,
            comment: {
                ...comment.toObject(),
                author: owner ? owner.name : "Autor no encontrado"
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            msg: "Error al buscar comentario", 
            error 
        });
    }
};

export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, creator, ...data } = req.body;
        const comment = await Comentario.findById(id);
        if (!comment) {
            return res.status(404).json({ 
                success: false, 
                msg: "Comentario no encontrado" 
            });
        }
        if (req.usuario.role === "USER_ROLE" && comment.author.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ 
                success: false, 
                msg: "No tiene autorizacion para modificar este comentario" 
            });
        }
        const updatedComment = await Comentario.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        res.status(200).json({
            success: true,
            msg: "Comentario actualizado",
            updatedComment
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            msg: "Error al actualizar el comentario", 
            error 
        });
    }
};

export const deleteComment = async (req, res) => {
    const { id } = req.params;
    try {
        const comment = await Comentario.findById(id);
        if (!comment) {
            return res.status(404).json({ 
                success: false, 
                msg: "Comentario no encontrado" 
            });
        }
        if (req.usuario.role === "USER_ROLE" && comment.author.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ 
                success: false, 
                msg: "No tiene autorizacion para eliminar este comentario" 
            });
        }
        comment.state = false;
        await comment.save(); 
        res.status(200).json({
            success: true,
            msg: "Comentario eliminado exitosamente"
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            msg: "Error al eliminar el comentario", 
            error 
        });
    }
};