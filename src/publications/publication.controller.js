import Usuario from "../users/user.model.js";
import Publicacion from "./publication.model.js";
import Categoria from "../categories/category.model.js";

export const savePublication = async (req, res) => {
    try {
        const { title, category, content } = req.body;
        const user = await Usuario.findById(req.usuario._id);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }
        const categoryExists = await Categoria.findById(category);
        if (!categoryExists) {
            return res.status(400).json({
                success: false,
                message: "Categoria no valida"
            });
        }
        const post = new Publicacion({
            title,
            category,
            content,
            creator: user._id,
            status: true
        });
        await post.save();
        res.status(200).json({
            success: true,
            message: "Publicacion creada",
            post
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al guardar la publicacion",
            error
        });
    }
};

export const getPublications = async (req, res) => {
    const { limite = 10, desde = 0 } = req.query;
    const query = { state: true };
    try {
        const posts = await Publicacion.find(query)
            .populate("creator", "nombre")
            .populate("category", "name")
            .skip(Number(desde))
            .limit(Number(limite));

        const total = await Publicacion.countDocuments(query);
        res.status(200).json({
            success: true,
            total,
            posts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener las publicaciones",
            error
        });
    }
};

export const searchPublication = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Publicacion.findById(id)
            .populate("creator", "nombre")
            .populate("category", "name");

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Publicacion no encontrada"
            });
        }
        res.status(200).json({
            success: true,
            post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al buscar la publicacion",
            error
        });
    }
};

export const deletePublication = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Publicacion.findById(id)
        if (!post) {
            return res.status(404).json({
                success: false,
                msg: "Publicacion no encontrada"
            });
        }
        if (req.usuario.role !== "ADMIN_ROLE" && post.creator.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ 
                success: false, 
                msg: "Solamente un administrador puede eliminar esta publicacion" 
            });
        }
        post.state = false;
        await post.save();

        res.status(200).json({
            success: true,
            message: "Publicacion eliminada correctamente"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al eliminar la publicacion",
            error
        });
    }
};

export const updatePublication = async (req, res) => {
    try {
        const { id } = req.params;
        const { category, ...data } = req.body;

        if (!req.usuario) {
            return res.status(401).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }
        const post = await Publicacion.findById(id).populate("creator");
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Publicacion no encontrada"
            });
        }
        if (req.usuario.role !== "ADMIN_ROLE" && post.creator._id.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ 
                success: false, 
                msg: "No tienes autorización para modificar esta publicación" 
            });
        }
        if (category) {
            const categoryExists = await Categoria.findById(category);
            if (!categoryExists) {
                return res.status(400).json({
                    success: false,
                    message: "Categoría inválida"
                });
            }
            post.category = category;
        }
        Object.assign(post, data);
        await post.save();
        res.status(200).json({
            success: true,
            msg: "Publicación actualizada",
            post
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error al actualizar la publicación",
            error
        });
    }
};