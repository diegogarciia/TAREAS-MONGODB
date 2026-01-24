import UserModel from '../models/Usuario.js';
import TareaModel from '../models/Tarea.js';
import { faker } from '@faker-js/faker';

const resolvers = {
    Query: {
        usuarios: async () => {
            return await UserModel.find();
        },
        usuario: async (_, { id }) => {
            return await UserModel.findOne({ id });
        },

        tareas: async () => {
            return await TareaModel.find();
        },
        tarea: async (_, { id }) => {
            return await TareaModel.findOne({ id });
        },
        tareasPorUsuario: async (_, { userId }) => {
            return await TareaModel.find({ idUsuarioAsignado: userId });
        }
    },

    Mutation: {
        
        usuariosPost: async (_, { id, nombre, email, password, rol }) => {
            const nuevoUsuario = new UserModel({ id, nombre, email, password, rol: rol || 'ESTANDAR' });
            return await nuevoUsuario.save();
        },

        generarUsuariosAleatorios: async (_, { cantidad }) => {
            const usuariosNuevos = [];
            for (let i = 0; i < (cantidad || 10); i++) {
                usuariosNuevos.push({
                    id: Math.floor(Math.random() * 1000000),
                    nombre: faker.person.fullName(),
                    email: faker.internet.email(),
                    password: faker.internet.password(),
                    rol: 'ESTANDAR'
                });
            }
            return await UserModel.insertMany(usuariosNuevos);
        },

        usuariosDelete: async (_, { id }) => {
            const resultado = await UserModel.deleteOne({ id });
            return resultado.deletedCount > 0;
        },

        agregarTarea: async (_, { idUsuarioAsignado, descripcion, duracion, dificultad, estado }) => {
            const ultimaTarea = await TareaModel.findOne().sort('-id');
            const nuevoId = ultimaTarea ? ultimaTarea.id + 1 : 1;

            const nuevaTarea = new TareaModel({
                id: nuevoId,
                idUsuarioAsignado,
                descripcion,
                duracion,
                dificultad,
                estado: estado || 'Todo'
            });

            return await nuevaTarea.save();
        },

        tareasDelete: async (_, { id }) => {
            const resultado = await TareaModel.deleteOne({ id });
            return resultado.deletedCount > 0;
        },

        tareaActualizarEstado: async (_, { id, estado }) => {
            return await TareaModel.findOneAndUpdate(
                { id },
                { estado },
                { new: true }
            );
        }
    },

    Tarea: {
        usuario: async (parent) => {
            try {
                return await UserModel.findOne({ id: parent.idUsuarioAsignado });
            } catch (error) {
                throw new Error("No se pudo cargar el usuario de esta tarea.");
            }
        }
    }
};

export default resolvers;