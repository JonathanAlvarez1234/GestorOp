import User from "../users/user.model.js";
import Publication from "../publications/publication.model.js";
import Comment from "../comment/comment.model.js";

export const saveComment = async (req, res) => {
    try {
        const data = req.body;
        const user = await User.findOne({ email: data.email });
        const post = await Publication.findById(data.postId);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        if (!post) {
            return res.status(400).json({
                success: false,
                message: "Post not found"
            });
        }

        const comment = new Comment({
            content: data.content,
            creatorCrUser: user._id,
            creatorCrPost: post._id,
            status: true
        });

        await comment.save();

        res.status(200).json({
            success: true,
            message: "Comment created",
            comment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error saving comment",
            error
        });
    }
}

export const searchComment = async (req, res) =>{
    const {id} = req.params;

    try {
        const comment = await Comment.findById(id);

        if(!comment){
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            })
        }

        const owner = await User.findById(comment.creatorCrUser);

        res.status(200).json({
            success: true,
            comment: {
                ...comment.toObject(),
                creatorCrUser: owner ? owner.name : "Creator not found"
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error searching for comment",
            error
        })
    }
}

export const deleteComment = async(req, res) => {

    const {id} = req.params;

    try {

        const comment = await Comment.findByIdAndUpdate(id, { status: false });        

        if (!comment) {
            return res.status(404).json({
                 success: false, 
                 msg: "Comment not found" 
            });
        }

        if (req.usuario.role === "USER_ROLE" && comment.creatorCrUser.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ 
                success: false, 
                msg: "No tiene autorización para modificar este comentario" 
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Comment successfully deleted"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting comment",
            error
        })
    }

}

export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, creator, ...data } = req.body; 

        const comment = await Comment.findByIdAndUpdate(id, data, { new: true });

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }

        if (req.usuario.role === "USER_ROLE" && comment.creatorCrUser.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ 
                success: false, 
                msg: "No tiene autorizacón para modificar este comentario" 
            });
        }

        res.status(200).json({
            success: true,
            msg: "Updated comment",
            comment
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error updating comment",
            error
        });
    }
}

export const getComments = async(req, res) => {
    const {limite = 10, desde = 0} = req.query;
    const query = {status: true};
    try {
        const comments = await Comment.find(query)
            .skip(Number(desde))
            .limit(Number(limite));
            
        const commentsWithOwnerNames =  await Promise.all(comments.map(async (comment) =>{
            const owner = await User.findById(comment.creatorCrUser);
            const post = await Publication.findById(comment.creatorCrPost)
            return{
                ...comment.toObject(),
                creatorCrUser: owner ? owner.nombre: "User not found",
                creatorCrPost: post ? post.title: "Post not found"
            }
        }));
        
        const total = await Comment.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            comments: commentsWithOwnerNames
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error getting comment",
            error
        })
    }
}