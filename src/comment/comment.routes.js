import { Router } from "express";
import { check } from "express-validator";
import { saveComment, getComments, searchComment, deleteComment, updateComment } from "./comment.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        check("publicationId", "El ID de la publicación es obligatorio").isMongoId(),
        check("content", "El contenido es obligatorio").not().isEmpty(),
        validarCampos
    ],
    saveComment
)

router.get("/", getComments)

router.get(
    "/findComment/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        validarCampos
    ],
    searchComment
)

router.put(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        validarCampos
    ],
    updateComment
)

router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        validarCampos
    ],
    deleteComment
)

export default router;