import {hash, verify} from "argon2";
import Usuario from '../users/user.model.js';
import { generarJWT } from '../helpers/generate-jwt.js';

export const login = async (req, res) => {
    const {email,password, username} = req.body;

    try {

        const user = await Usuario.findOne({
            $or: [{email},{username}]
        })

        if(!user){
            return res.status(400).json({
                msg: "Credenciales incorrectas, correo no existente en la base de datos"
            });
        }

        if(!user.status){
            return res.status(400).json({
                msg: "El usuario no existe en la base de datos"
            }); 
        }

        const validPassword = await verify(user.password, password);
        if(!validPassword){
            return res.status(400).json({
                msg: "La contraseña es incorrecta"
            })
        }

        const token = await generarJWT(user.id);
        
        res.status(200).json({
            msg: "Inicio de sesión exitoso",
            userDetails: {
                username: user.username,
                token: token
            }
        })

    } catch (error) {
        console.log(e);
        res.status(500).json({
            msg: 'Server error',
            error: e.message
        })
    }
}

export const register = async (req, res) => {
    try {
        const data = req.body;

        if (data.role === "ADMIN_ROLE") {
            return res.status(400).json({
                success: false,
                message: "No se puede registrar un usuario con el rol ADMIN_ROLE"
            });
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
        })

        return res.status(200).json({
            message: "User register successfully",
            userDetails:{
                user: user.email
            }
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "User registration failed",
            error: error.message
        })
    }
}

