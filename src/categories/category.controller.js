import Category from "../categories/category.model.js"
import Post from "../publications/publication.model.js"

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = new Category({ name });
        await category.save();

        res.status(200).json({
            success: true,
            message: "Category created",
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating category",
            error
        });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ status: true });
        res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error getting categories",
            error
        });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const category = await Category.findByIdAndUpdate(id, { name }, { new: true });

        res.status(200).json({
            success: true,
            message: "Updated category",
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating category",
            error
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const defaultCategory = await Category.findOne({ name: "General" });
        if (!defaultCategory) {
            return res.status(500).json({
                success: false,
                message: "Default category not found"
            });
        }

        await Post.updateMany({ category: id }, { category: defaultCategory._id });
        await Category.findByIdAndUpdate(id, { status: false });

        res.status(200).json({
            success: true,
            message: "Category removed"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting category",
            error: error.message 
        });
    }
};