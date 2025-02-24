import { Router } from "express";
import { check } from "express-validator";
import { getUsers, getUserById, updateUser, deleteUser, unsubscribeSesion} from "./user.controller.js";
import { existeUsuarioById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarRol } from "../middlewares/validar-roles.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/", getUsers);

router.get('/findCourse',
    [
        validarJWT
    ] 
);

router.get(
    "/findUser/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    getUserById
)

router.post(
    "/assign-course", [
        validarJWT,
        validarRol("ADMIN_ROLE")
    ]
    );

router.put(
        "/:id",
        [
            validarJWT,
            check("id", "No es un ID válido").isMongoId(),
            check("id").custom(existeUsuarioById),
            validarCampos
        ],
        updateUser
);
    
router.delete(
        "/unsubscribe",
        [
            validarJWT,
            validarRol("USER_ROLE")
        ],
        unsubscribeSesion
);
    
router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarRol("ADMIN_ROLE"),
        validarCampos
    ],
    deleteUser
)

export default router;

