import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import kleur from 'kleur';
import mongoose from "mongoose";
mongoose.set('strictQuery', false);

class Server {
    
    constructor() {
        this.app = express();
        
        this.tasksPath = '/tasks'; 
        this.authPath  = '/auth';  

        this.middlewares();
        this.conectarMongoose();
        this.routes();
    }

    async conectarMongoose() {
        try {
            await mongoose.connect(process.env.DB_URL, {
                dbName: process.env.DB_DATABASE,
            });
            console.log(kleur.blue().bold('🔵 Conexión exitosa a MongoDB: ' + process.env.DB_DATABASE));
        } catch (error) {
            console.error(kleur.red().bold('🔴 Error al conectar a MongoDB:'), error);
        }
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    routes() {

    }

    listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(kleur.green().bold(`🟢 Servidor corriendo en puerto: ${process.env.PORT}`));
        });
    }
}

export { Server };