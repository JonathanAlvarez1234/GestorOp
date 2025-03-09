import {hash, verify} from "argon2";
import Usuario from '../users/user.model.js';
import { generarJWT } from '../helpers/generate-jwt.js';

export const register = async (req, res) => {
    try {
        const data = req.body;
        if (!data.name || !data.email || !data.password) {
            return res.status(400).json({ 
                success: false, 
                msg: "Todos los campos son obligatorios" 
            });
        }
        if (data.role === "ADMIN_ROLE") {
            return res.status(400).json({
                success: false,
                msg: "No se puede registrar un usuario con el rol ADMIN_ROLE"
            });
        }
        const existingUser = await Usuario.findOne({ email: data.email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                msg: "El correo ya existente" });
        }
        const encryptedPassword = await hash(data.password);
        const user = await Usuario.create({
            name: data.name,
            surname: data.surname,
            username: data.username,
            email: data.email,
            phone: data.phone,
            password: encryptedPassword,
            role: data.role || "USER_ROLE"
        });
        return res.status(200).json({
            msg: "Usuario registrado",
            userDetails: { user: user.email }
        });
    } catch (error) {
        console.error("Error en el registro:", error);
        return res.status(500).json({
            msg: "Error al registrar usuario",
            error: error.message
        });
    }
};

export const login = async (req, res) => {
    const { email, password, username } = req.body;
    try {
        if (!email && !username) {
            return res.status(400).json({ 
                msg: "Ingrese el correo u nombre de usuario" 
            });
        }
        const user = await Usuario.findOne({
            $or: [{ email }, { username }]
        });
        if (!user) {
            return res.status(400).json({
                msg: "usuario no encontrado"
            });
        }
        if (user.status === false) {
            return res.status(400).json({
                msg: "El usuario no existe en la base de datos"
            });
        }
        const validPassword = await verify(user.password, password);
        if (!validPassword) {
            return res.status(400).json({ 
                msg: "Contraseña es incorrecta" 
            });
        }
        const token = await generarJWT(user.id);
        res.status(200).json({
            msg: "Inicio de sesión exitoso",
            userDetails: {
                username: user.username,
                token: token
            }
        });
    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({
            msg: "Server error",
            error: error.message
        });
    }
};


