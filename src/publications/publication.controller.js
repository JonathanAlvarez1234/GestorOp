import User from "../users/user.model.js";
import Publication from "./publication.model.js";
import Category from "../categories/category.model.js";

export const savePublication = async (req, res) => {
    try {
        const { title, category, content } = req.body;
        const user = await User.findById(req.usuario._id); 

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({
                success: false,
                message: "Invalid category"
            });
        }

        const post = new Publication({
            title,
            category,
            content,
            creator: user._id,
            status: true
        });

        await post.save();

        res.status(200).json({
            success: true,
            message: "Post created",
            post
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error saving post",
            error
        });
    }
};

export const getPublications = async(req, res) => {
    const { limite = 10, desde = 0 } = req.query;
    const query = { status: true };
    
    try {
        const posts = await Publication.find(query)
            .populate("creator", "nombre")
            .populate("category", "name")
            .skip(Number(desde))
            .limit(Number(limite));

        const total = await Publication.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            posts
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error getting posts",
            error
        });
    }
};

export const searchPublication = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id)
            .populate("creator", "nombre")
            .populate("category", "name");

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        res.status(200).json({
            success: true,
            post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error searching for post",
            error
        });
    }
};

export const deletePublication = async(req, res) => {
    const { id } = req.params;

    try {
        const post = await Publication.findById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                msg: "Post not found"
            });
        }

        if (req.usuario.role === "USER_ROLE" && post.creator.toString() !== req.usuario._id.toString()) {
            return res.status(400).json({ 
                success: false, 
                msg: "No tienen autorización para eliminar esta publicación" 
            });
        }

        post.status = false;
        await post.save();

        res.status(200).json({
            success: true,
            message: "Post deleted succesfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error deleting post",
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
                message: "Unauthenticated user"
            });
        }

        const post = await Publication.findById(id).populate("creator");

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        if (req.usuario.role === "USER_ROLE" && post.creator._id.toString() !== req.usuario._id.toString()) {
            return res.status(400).json({ 
                success: false, 
                msg: "No tiene auorización para modificar esta publicación" 
            });
        }

        if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid category"
                });
            }
            post.category = category;
        }

        Object.assign(post, data);
        await post.save();

        res.status(200).json({
            success: true,
            msg: "Post updated",
            post
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error updating post",
            error
        });
    }
};