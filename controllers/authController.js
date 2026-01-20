import { response } from 'express';
import UserModel from '../models/Usuario.js';
import { generarJWT_Roles } from '../helpers/generate_jwt.js'; 

export const login = async (req, res = response) => {
    const { id, nombre } = req.body;  

    try {
        const usuario = await UserModel.findOne({ id, nombre });  

        if (!usuario) {
            console.log('Usuario no encontrado.');
            return res.status(400).json({ msg: 'Usuario o nombre incorrecto.' });
        }

        const token = generarJWT_Roles(usuario.id, [usuario.rol]); 

        console.log('Usuario correcto! ' + usuario.nombre);
        res.status(200).json({ usuario, token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor.' });
    }
};