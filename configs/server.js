'use strict'

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { dbConnection } from "./mongo.js";
import limiter from '../src/middlewares/validar-cant-peticiones.js'
import authRoutes from '../src/auth/auth.routes.js'
import userRoutes from "../src/users/user.routes.js"
import publicationRoutes from "../src/publications/publication.model.js"
import commentRoutes from "../src/comment/comment.routes.js"
import { createAdministrator } from "../src/users/user.controller.js";
import categoryRoutes from "../src/categories/category.routes.js";
import Category from "../src/categories/category.model.js";

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
        app.use("/gestorOp/v1/publication", publicationRoutes);
        app.use("/gestorOp/v1/comments", commentRoutes);
        app.use("/gestorOp/v1/categories", categoryRoutes);

}

const stCategory = async () => {
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



const conectarDB = async () => {
    try {
        await dbConnection();
        console.log("Successful connection with the database");
        await stCategory();
    } catch (error) {
        console.log("Error connecting to the database", error);
    }
}

export const initServer = async () => {
    const app = express();
    const port = process.env.PORT || 3001;
    try {
        await conectarDB();
        await createAdministrator();
        middlewares(app);
        routes(app);

        app.listen(port);
        console.log(`Server running on port ${port}`)
    } catch (error) {
        console.log(`server init failed: ${error}`)
    }
    
}   