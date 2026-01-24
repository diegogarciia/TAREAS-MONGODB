import UserModel from '../models/Usuario.js';
import { faker } from '@faker-js/faker';

const controlador = {

    generarUsuariosAleatorios: async (req, res) => {
        const { cantidad = 10 } = req.params;
        const usuariosNuevos = [];
        
        try {
            for (let i = 0; i < cantidad; i++) {
                usuariosNuevos.push({
                    id: Math.floor(Math.random() * 1000000),
                    nombre: faker.person.fullName(),
                    email: faker.internet.email(),
                    password: faker.internet.password(), 
                    rol: 'ESTANDAR',
                });
            }

            const usuariosInsertados = await UserModel.insertMany(usuariosNuevos);
            res.status(201).json({
                msg: `Se han insertado ${usuariosInsertados.length} usuarios correctamente`,
                usuarios: usuariosInsertados
            });
        } catch (error) {
            res.status(500).json({ msg: 'Error al generar usuarios masivos' });
        }
    },
    usuariosGet : async (req, res) => {
        try {
            const personas = await UserModel.find().lean();
            
            if (personas.length > 0) {
                console.log(personas)
                console.log('🔵 Listado correcto!');
                res.status(200).json(personas);
            } else {
                console.log('‼️ No hay registros!');
                res.status(200).json({ 'msg': 'No se han encontrado registros' });
            }
        } catch (error) {
            console.error('❌ Error al obtener usuarios:', error);
            res.status(500).json({ 'msg': 'Error al obtener usuarios' });
        }
    },
    usuarioGet : async (req, res) => {

        try {
            const usuario = await UserModel.find({id: req.params.id});
            if (usuario.length > 0)  {
                console.log('🔵 Usuario encontrado!');
                res.status(200).json(usuario);
            } else {
                console.log('‼️ Usuario no encontrado!');
                res.status(404).json({ 'msg': 'Usuario no encontrado' });
            }
        } catch (error) {
            console.error('❌ Error al obtener usuario por ID:', error);
            res.status(500).json({ 'msg': 'Error al obtener usuario por ID' });
        }
    },
    usuariosPost : async (req, res) => {
        const { id, nombre, email, password, rol } = req.body;

        try {
            const usuario = await UserModel.create({
                id,
                nombre,
                email,
                password,
                rol 
            });

            console.log('🔵 Usuario registrado correctamente!');
            res.status(201).json(usuario);

        } catch (error) {
            console.error('❌ Error al registrar usuario:', error);
            res.status(500).json({ 'msg': 'Error al registrar usuario' });
        }
    },
    usuariosPut : async (req, res) => {
        const { nombre, email, password } = req.body;

        try {
            const usuarioActualizado = await UserModel.findOneAndUpdate({id : req.params.id}, req.body, { new: true }); 
            if (usuarioActualizado) {
                console.log('🔵 Usuario actualizado correctamente!');
                res.status(200).json(usuarioActualizado);
            } else {
                console.log('‼️ Usuario no encontrado!');
                res.status(404).json({ 'msg': 'Usuario no encontrado' });
            }
        } catch (error) {
            console.error('❌ Error al actualizar usuario:', error);
            res.status(500).json({ 'msg': 'Error al actualizar usuario' });
        }
    },
    usuariosPutRol : async (req, res) => {
        const { rol } = req.body;

        try {
            const usuarioActualizado = await UserModel.findOneAndUpdate({id : req.params.id}, req.body, { new: true }); 
            if (usuarioActualizado) {
                console.log('🔵 Usuario actualizado correctamente!');
                res.status(200).json(usuarioActualizado);
            } else {
                console.log('‼️ Usuario no encontrado!');
                res.status(404).json({ 'msg': 'Usuario no encontrado' });
            }
        } catch (error) {
            console.error('❌ Error al actualizar usuario:', error);
            res.status(500).json({ 'msg': 'Error al actualizar usuario' });
        }
    },
    usuariosDelete : async (req, res) => {

        try {
            const usuarioEliminado = await UserModel.deleteOne({id:req.params.id});
            if (usuarioEliminado.deletedCount > 0) {
                console.log('🔵 Usuario eliminado correctamente!');
                res.status(200).json(usuarioEliminado);
            } else {
                console.log('‼️ Usuario no encontrado!');
                res.status(404).json({ 'msg': 'Usuario no encontrado' });
            }
        } catch (error) {
            console.error('❌ Error al eliminar usuario:', error);
            res.status(500).json({ 'msg': 'Error al eliminar usuario' });
        }
    }
}

export default controlador;  