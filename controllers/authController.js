import { response } from 'express';
import UserModel from '../models/Usuario.js';
import { generarJWT_Roles, generarJWT } from '../helpers/generate_jwt.js'; 
import { googleVerify } from '../helpers/google-verify.js';
import { faker } from '@faker-js/faker';

export const login = async (req, res = response) => {
    const { email, password } = req.body;  

    try {
        const usuario = await UserModel.findOne({ email, password });  

        if (!usuario) {
            console.log('Usuario no encontrado.');
            return res.status(400).json({ msg: 'Usuario o email incorrecto.' });
        }

        const token = generarJWT_Roles(usuario.id, [usuario.email]); 

        console.log('Usuario correcto! ' + usuario.email);
        res.status(200).json({ usuario, token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor.' });
    }
};

export const googleSignin = async(req, res) => {
    const { id_token } = req.body;
    console.log(`Token recibido desde el cliente: ${id_token}`);
    
    try {
        const { correo, nombre, img } = await googleVerify( id_token );

        let usuario = await UserModel.findOne({ email: correo });

        const ultimoUsuario = await UserModel.findOne().sort('-id');
        const nuevoId = ultimoUsuario ? ultimoUsuario.id + 1 : 1;

        if (!usuario) {
            const data = {
                id: nuevoId,
                nombre,
                email: correo,
                img,
                rol: 'ESTANDAR',
                password: faker.internet.password()
            };
            usuario = new UserModel(data);
            await usuario.save();
        }
        
        const token = await generarJWT(usuario.id);
        res.status(200).json({
            usuario, 
            token    
        });
    } catch (error) {

        res.status(400).json({
            msg: 'Token de Google no es válido'
        })

    }

}