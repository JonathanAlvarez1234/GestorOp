'use strict'

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { dbConnection } from "./mongo.js";
import limiter from '../src/middlewares/validar-cant-peticiones.js'
import authRoutes from '../src/auth/auth.routes.js'
import userRoutes from "../src/users/user.routes.js"
import postRoutes from "../src/posts/post.router.js"
import commentRoutes from "../src/comment/comment.routes.js"
import categoryRoutes from "../src/categories/category.routes.js";
import Category from "../src/categories/category.model.js";
import Usuario from "../src/users/user.model.js";
import { hash } from "argon2";

const configurarMiddlewares = (app) => {
    app.use(express.urlencoded({extended: false}));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const configurarRutas = (app) =>{
        app.use("/postSystem/v1/auth", authRoutes);
        app.use("/postSystem/v1/users", userRoutes);
        app.use("/postSystem/v1/posts", postRoutes);
        app.use("/postSystem/v1/comments", commentRoutes);
        app.use("/postSystem/v1/categories", categoryRoutes);

}

const initializeCategories = async () => {
    try {
        const defaultCategory = await Category.findOne({ name: "General" });
        if (!defaultCategory) {
            await Category.create({ name: "General" });
            console.log("Categoría por defecto creada: General");
        } else {
            console.log("Categoría por defecto ya existente");
        }
    } catch (error) {
        console.error("Error al inicializar categorías:", error);
    }
};



const crearAdmin = async () => {
    try {
        const adminExistente = await Usuario.findOne({ role: "ADMIN_ROLE" });

        if (!adminExistente) {
            const passwordEncriptada = await hash("Admin123");

            const admin = new Usuario({
                name: "Admin",
                surname: "istrador",
                username: "4dmin",
                email: "admin@gmail.com",
                phone: "12346789",
                password: passwordEncriptada,
                role: "ADMIN_ROLE"
            });

            await admin.save();
            console.log("Administrador creado exitosamente");
        } else {
            console.log("El administrador ya existente");
        }
    } catch (error) {
        console.error("Error al crear el administrador:", error);
    }
};


const conectarDB = async () => {
    try {
        await dbConnection();
        console.log("Conexion existosa con la base de datos");
        await initializeCategories();
    } catch (error) {
        console.log("Error al conectar con la base de datos", error);
    }
}

export const initServer = async () => {
    const app = express();
    const port = process.env.PORT || 3001;

    await conectarDB();
    await crearAdmin();
    configurarMiddlewares(app);
    configurarRutas(app);

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}   