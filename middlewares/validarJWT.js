import jwt from 'jsonwebtoken';
import {response, request} from 'express' 

export const validarJWT = (req , res , next) => { 
    const token = req.header('x-token') 
    

    if (!token){
        return res.status(401).json({'msg':'No hay token en la petición.'})
    }

    try {
        
        const {uid, roles} = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        req.uid = uid
        req.roles = roles
        console.log(uid)
        console.log(roles)
        console.log(token)
        next()
        
    }catch(error){
        console.log(error);
        res.status(401).json({'msg':'Token no válido.'})
    }
}