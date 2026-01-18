import { response } from 'express';
import UserModel from '../models/Usuario.js';
import { generarJWT } from '../helpers/generate_jwt.js';

export const login = async (req, res = response) => {
    const { email, password } = req.body;

    try {
        const usuario = await UserModel.findOne({ email });

        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        const passwordValida = (password === usuario.password); 

        if (!passwordValida) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        const token = generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}