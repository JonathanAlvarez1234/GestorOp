import { Router } from "express";
import { createCategory, getCategories, updateCategory, deleteCategory } from "../categories/category.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

router.post(
    "/",
    [
    validarJWT,
    tieneRole("ADMIN_ROLE")
    ],
    createCategory
);

router.get("/", getCategories);

router.put(
    "/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE")
    ],
    updateCategory
);

router.delete(
    "/:id", 
    [
        validarJWT,
        tieneRole("ADMIN_ROLE")
    ],
    deleteCategory
    );

export default router;