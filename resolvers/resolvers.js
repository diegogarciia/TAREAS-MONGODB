import UserModel from '../models/Usuario.js';
import TareaModel from '../models/Tarea.js';
import { faker } from '@faker-js/faker';
import jwt from 'jsonwebtoken';

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
        },
        tareas: async (_, { dificultad }) => {
            const filtro = dificultad ? { dificultad } : {};
            return await TareaModel.find(filtro);
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

        agregarTarea: async (_, { idUsuarioAsignado, descripcion, duracion, dificultad, estado }, { io }) => {
            const ultimaTarea = await TareaModel.findOne().sort('-id');
            const nuevoId = ultimaTarea ? ultimaTarea.id + 1 : 1;

            const nuevaTarea = new TareaModel({
                id: nuevoId,
                idUsuarioAsignado: idUsuarioAsignado || 0,
                descripcion,
                duracion,
                dificultad,
                estado: estado || 'Todo'
            });

            const resultado = await nuevaTarea.save();
            
            if (io) io.emit('actualizar-dashboard'); 
            
            return resultado;
        },

        tareasDelete: async (_, { id }) => {
            const resultado = await TareaModel.deleteOne({ id });
            return resultado.deletedCount > 0;
        },

        tareaActualizarEstado: async (_, { id, estado }, { io }) => {
            const tareaActual = await TareaModel.findOne({ id });
            if (!tareaActual) throw new Error("Tarea no encontrada");
            
            const nuevoEstado = estado.toLowerCase();
            const estadosPermitidos = ['por hacer', 'haciendo', 'hecha'];
            
            if (!estadosPermitidos.includes(nuevoEstado)) {
                throw new Error("Estado no válido. Usa: 'por hacer', 'haciendo' o 'hecha'.");
            }
            
            const tareaActualizada = await TareaModel.findOneAndUpdate(
                { id },
                { estado: nuevoEstado },
                { new: true }
            );
            
            if (tareaActualizada && io) io.emit('actualizar-dashboard');

            return tareaActualizada;
        },
        
        login: async (_, { email, password }) => {
            const usuario = await UserModel.findOne({ email });
            if (!usuario) throw new Error('Usuario no encontrado');
            
            const esValida = (password === usuario.password); 
            if (!esValida) throw new Error('Contraseña incorrecta');

            const SECRET_KEY = process.env.SECRETORPRIVATEKEY

            const token = jwt.sign(
                { id: usuario.id, email: usuario.email },
                SECRET_KEY,
                { expiresIn: '24h' }
            );
            
            return { token, usuario };
        },

        asignarTarea: async (_, { id, idUsuarioAsignado }, { io }) => {
            const tareaActualizada = await TareaModel.findOneAndUpdate(
                { id: id },
                { idUsuarioAsignado: idUsuarioAsignado },
                { new: true } 
            );
            
            if (tareaActualizada && io) {
                io.emit('actualizar-dashboard');
            }
            
            return tareaActualizada;
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
    },

    Usuario: {
        tareas: async (parent) => {
            try {
                return await TareaModel.find({ idUsuarioAsignado: parent.id });
            } catch (error) {
                throw new Error("No se pudieron cargar las tareas de este usuario.");
            }
        }
    }
};

export default resolvers;