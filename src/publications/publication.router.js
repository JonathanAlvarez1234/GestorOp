import { Router } from "express";
import { check } from "express-validator";
import { savePublication, getPublications, searchPublication, deletePublication, updatePublication } from "./publication.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

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
    savePublication
)

router.get("/", getPublications)

router.get(
    "/findPost/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        validarCampos
    ],
    searchPublication
)

router.put(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        validarCampos
    ],
    updatePublication
)

router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "No es unn ID válido").isMongoId(),
        validarCampos
    ],
    deletePublication
)

export default router;



