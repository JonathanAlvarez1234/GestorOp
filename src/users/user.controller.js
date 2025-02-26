import { response, request } from "express";
import { hash } from "argon2";
import User from "./user.model.js";

export const getUsers = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { estado: true };
        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error getting user",
            error
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error getting user",
            error
        });
    }
};

export const updateUser = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { password, ...data } = req.body;

        if (req.usuario.role === "USER_ROLE" && id !== req.usuario._id.toString()) {
            return res.status(400).json({
                success: false,
                msg: "No tiene autorizacón para actualizar la información de otro usuario"
            });
        }

        if (password) {
            data.password = await hash(password);
        }

        const user = await User.findByIdAndUpdate(id, data, { new: true });

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            msg: "User updated",
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error updating user",
            error
        });
    }
};

export const createAdministrator = async () => {
    try {
        const adminEnBD = await User.findOne({ role: "ADMIN_ROLE" });

        if (!adminEnBD) {
            const passwordEncrypted = await hash("Jonas360");

            const admin = new User({
                name: "Admin",
                surname: "istrador",
                username: "4dmin",
                email: "admin@gmail.com",
                phone: "20003000",
                password: passwordEncrypted,
                role: "ADMIN_ROLE"
            });

            await admin.save();
            console.log("Administrator created successfully");
        } else {
            console.log("Existing administrator");
        }
    } catch (error) {
        console.error("Error creating administrator:", error);
    }
};