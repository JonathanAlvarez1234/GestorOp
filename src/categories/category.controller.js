import Categoria from "../categories/category.model.js"
import Publicacion from "../publications/publication.model.js"

export const createCategory = async (req, res) => {
    try {
        if (req.usuario.role !== "ADMIN_ROLE") {
            return res.status(403).json({
                success: false,
                msg: "Solo un administrador puede crear una nueva categoría"
            });
        }
        const { name } = req.body;
        const existingCategory = await Categoria.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ 
                success: false, 
                msg: "La categoria ya existe" 
            });
        }
        const categoria = new Categoria({ name, state: true });
        await categoria.save();
        res.status(200).json({
            success: true,
            msg: "Categoria creada",
            categoria
        });
    } catch (error) {
        console.error("Error al crear la categoria:", error);
        res.status(500).json({ 
            success: false, 
            msg: "Error al crear la categoria", 
            error: error.message 
        });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categorias = await Categoria.find({ state: true });
        res.status(200).json({ success: true, categorias });
    } catch (error) {
        console.error("Error al obtener las categorías:", error);
        res.status(500).json({ 
            success: false, 
            msg: "Error al obtener las categorías", 
            error: error.message 
        });
    }
};

export const updateCategory = async (req, res) => {
    try {
        if (req.usuario.role !== "ADMIN_ROLE") {
            return res.status(403).json({
                success: false,
                msg: "Solamente un administrador puede actualizar categorías"
            });
        }
        const { id } = req.params;
        const { name } = req.body;
        const existingCategory = await Categoria.findOne({ name, _id: { $ne: id } });
        if (existingCategory) {
            return res.status(400).json({ 
                success: false, 
                msg: "Categoria existente" 
            });
        }
        const categoria = await Categoria.findByIdAndUpdate(id, { name }, { new: true });
        if (!categoria) {
            return res.status(404).json({ 
                success: false, 
                msg: "Categoria no encontrada" 
            });
        }
        res.status(200).json({ 
            success: true, 
            msg: "Categoria actualizada", 
            categoria 
        });
    } catch (error) {
        console.error("Error al actualizar la categoria:", error);
        res.status(500).json({ 
            success: false, 
            msg: "Error al actualizar la categoria", 
            error: error.message 
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        if (req.usuario.role !== "ADMIN_ROLE") {
            return res.status(403).json({
                success: false,
                msg: "Solamente un administrador puede eliminar categorias"
            });
        }
        const { id } = req.params;
        const categoryToDelete = await Categoria.findById(id);
        if (!categoryToDelete) {
            return res.status(404).json({ 
                success: false, 
                msg: "Categoria no encontrada" 
            });
        }
        if (categoryToDelete.name === "General") {
            return res.status(400).json({
                success: false,
                msg: "La categoria predeterminada 'General' no se puede eliminar"
            });
        }
        let defaultCategory = await Categoria.findOne({ name: "General" });
        if (!defaultCategory) {
            defaultCategory = new Categoria({ name: "General", state: true });
            await defaultCategory.save();
        }
        await Publicacion.updateMany({ categoria: id }, { categoria: defaultCategory._id });
        await Categoria.findByIdAndUpdate(id, { state: false });
        res.status(200).json({ 
            success: true, 
            msg: "Categoria eliminada correctamente" 
        });
    } catch (error) {
        console.error("Error al eliminar la categoria:", error);
        res.status(500).json({ 
            success: false, 
            msg: "Error al eliminar la categoria", 
            error: error.message 
        });
    }
};

export const createCategoryDefault = async () => {
    try {
        const defaultCategory = await Categoria.findOne({ name: "General" });
        if (!defaultCategory) {
            const newCategory = new Categoria({ name: "General", state: true });
            await newCategory.save();
            console.log("Categoria 'General' creada");
        }
    } catch (error) {
        console.error("Error al inicializar las categorias:", error);
    }
};