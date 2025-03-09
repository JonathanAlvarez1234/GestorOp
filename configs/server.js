'use strict'

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import limiter from '../src/middlewares/validar-cant-peticiones.js'
import authRoutes from '../src/auth/auth.routes.js'
import userRoutes from "../src/users/user.routes.js"
import publicationRoutes from "../src/publications/publication.routes.js"
import commentRoutes from "../src/comment/comment.routes.js"
import categoryRoutes from "../src/categories/category.routes.js";
import { dbConnection } from "./mongo.js";
import { createAdministrator } from "../src/users/user.controller.js";
import { createCategoryDefault } from "../src/categories/category.controller.js";

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

const conectarDB = async () => {
    try {
        await dbConnection();
        console.log("Successful connection with the database");
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
        createCategoryDefault();
        middlewares(app);
        routes(app);
        app.listen(port);
        console.log(`Server running on port ${port}`)
    } catch (error) {
        console.log(`server init failed: ${error}`)
    }
    
}   