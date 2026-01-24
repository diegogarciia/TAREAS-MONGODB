import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import kleur from 'kleur';
import mongoose from "mongoose";
mongoose.set('strictQuery', false);
import {router as userRoutes} from '../routes/userRoutes.js';
import {router as tareaRoutes} from '../routes/tareaRoutes.js';
import {router as authRoutes} from '../routes/authRoutes.js';
import { expressMiddleware } from '@as-integrations/express4';
import typeDefs from '../typeDefs/typeDefs.js';
import resolvers from '../resolvers/resolvers.js';
import { ApolloServer } from '@apollo/server';
import { router as googleRoutes} from '../routes/googleRoutes.js';

class Server {
    
    constructor() {
        this.app = express();
        
        this.tasksPath = '/tasks'; 
        this.authPath  = '/auth';
        this.graphQLPath = '/graphql';  

        this.middlewares();
        this.conectarMongoose();
        this.routes();

        this.serverGraphQL = new ApolloServer({
            typeDefs,
            resolvers,
            plugins: [
                {
                    async requestDidStart() {
                        return {
                            async willSendResponse({ response, errors }) {
                                if (errors) {
                                    response.body.singleResult.errors = errors.map(err => ({
                                        message: err.message
                                    }));
                                }
                            },
                        };
                    },
                },
            ],
        });
    }

    async start() {
        await this.serverGraphQL.start();
        this.applyGraphQLMiddleware();
        this.listen();
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
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.authPath, userRoutes, authRoutes);
        this.app.use(this.tasksPath, tareaRoutes);
        this.app.use('/api/auth', googleRoutes);
    }

    applyGraphQLMiddleware() {
        this.app.use(this.graphQLPath , express.json(), expressMiddleware(this.serverGraphQL));
    }

    listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(kleur.green(`🟢 Servidor GraphQL escuchando en: ${process.env.URL}:${process.env.PORT}${this.graphQLPath}`));
            console.log(kleur.blue(`🔵 Servidor API Rest escuchando en: ${process.env.URL}:${process.env.PORT}${this.usuariosPath}`));
            console.log(kleur.yellow(`🌎 Página de prueba escuchando en: ${process.env.URL}:${process.env.PORT}`));
        })
        this.applyGraphQLMiddleware()
    }
}

export { Server };