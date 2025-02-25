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

const middlewares = (app) => {
    app.use(express.urlencoded({extended: false}));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const routes = (app) =>{
        app.use("/gestorOp/v1/auth", authRoutes);
        app.use("/gestorOp/v1/users", userRoutes);
        app.use("/gestorOp/v1/posts", postRoutes);
        app.use("/gestorOp/v1/comments", commentRoutes);
        app.use("/gestorOp/v1/categories", categoryRoutes);

}

const startCategory = async () => {
    try {
        const defaultCategory = await Category.findOne({ name: "General" });
        if (!defaultCategory) {
            await Category.create({ name: "General" });
            console.log("Default category created");
        } else {
            console.log("Existing default category");
        }
    } catch (error) {
        console.error("Error initializing categories:", error);
    }
};

const createAdministrator = async () => {
    try {
        const adminExistente = await Usuario.findOne({ role: "ADMIN_ROLE" });

        if (!adminExistente) {
            const passwordEncrypted = await hash("Admin123");

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
            console.log("Administrator created successfully");
        } else {
            console.log("Existing administrator");
        }
    } catch (error) {
        console.error("Error creating administrator:", error);
    }
};


const conectarDB = async () => {
    try {
        await dbConnection();
        console.log("Successful connection with the database");
        await startCategory();
    } catch (error) {
        console.log("Error connecting to the database", error);
    }
}

export const initServer = async () => {
    const app = express();
    const port = process.env.PORT || 3001;

    await conectarDB();
    await createAdministrator();
    middlewares(app);
    routes(app);

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}   