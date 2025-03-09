import { response, request } from "express";
import mongoose from "mongoose";
import { hash } from "argon2";
import Usuario from "./user.model.js";

export const getUsers = async (req = request, res = response) => {
    try {
        const users = await Usuario.find();
        const total = await Usuario.countDocuments();
        res.status(200).json({
            success: true,
            total,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener usuarios",
            error
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                msg: "ID de usuario invalido"
            });
        }
        const user = await Usuario.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "Usuario no encontrado"
            });
        }
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al obtener el usuario",
            error
        });
    }
};

export const updateUser = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { password, ...data } = req.body;
        if (!req.usuario || (req.usuario.role !== "ADMIN_ROLE" && id !== req.usuario._id?.toString())) {
            return res.status(403).json({
                success: false,
                msg: "No tienes autorización para actualizar la información de otro usuario"
            });
        }
        if (password && password.trim() !== "") {
            data.password = await hash(password);
        }
        const user = await Usuario.findByIdAndUpdate(id, data, { new: true });
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "Usuario no encontrado"
            });
        }
        res.status(200).json({
            success: true,
            msg: "Usuario actualizado",
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al actualizar el usuario",
            error
        });
    }
};

export const createAdministrator = async () => {
    try {
        const adminEnBD = await Usuario.findOne({ role: "ADMIN_ROLE" });
        if (!adminEnBD) {
            const passwordEncrypted = await hash("Jonas360");
            const admin = new Usuario({
                name: "Admin",
                surname: "istrador",
                username: "4dmin",
                email: "admin@gmail.com",
                phone: "20003000",
                password: passwordEncrypted,
                role: "ADMIN_ROLE"
            });
            await admin.save();
            console.log("Administrador iniciado");
        } else {
            console.log("Administrador activo");
        }
    } catch (error) {
        console.error("Error creando administrador:", error);
    }
};