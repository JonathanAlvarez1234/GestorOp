import { Router } from "express";
import { check } from "express-validator";
import {savePost, getPosts, searchPost, deletePost, updatePost} from "./post.controller.js";
import {validarCampos} from "../middlewares/validar-campos.js";
import {validarJWT} from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        check("title", "El título es obligatorio").not().isEmpty(),
        check("category", "La categoría es obligatoria").not().isEmpty(),
        check("content", "El contenido es obligatorio").not().isEmpty(),
        validarCampos
    ],
    savePost
)

router.get("/", getPosts)

router.get(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        validarCampos
    ],
    searchPost
)

router.put(
    "/:id",
    [
        validarJWT,
        validarCampos
    ],
    updatePost
)

router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "No es unn ID válido").isMongoId(),
        validarCampos
    ],
    deletePost
)

export default router;



