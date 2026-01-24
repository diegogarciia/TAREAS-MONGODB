import { response } from 'express';
import UserModel from '../models/Usuario.js';
import { generarJWT_Roles, generarJWT } from '../helpers/generate_jwt.js'; 
import { googleVerify } from '../helpers/google-verify.js';

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

export const googleSignin = async(req, res = response) => {

    const { id_token } = req.body;
    console.log(`Token recibido desde el cliente: ${id_token}`);
    
    try {
        const { correo, nombre, img } = await googleVerify( id_token );

        console.log(`Comprobaríamos el usuario: ${correo}, ${nombre} ${img}`);
        
        const token = generarJWT(correo); 
        console.log(`Token JWT para consultar nuestro servicio generado: ${token}`);
        res.status(200).json({correo, token, img});
        
    } catch (error) {

        res.status(400).json({
            msg: 'Token de Google no es válido'
        })

    }

}