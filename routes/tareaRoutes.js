import { Router } from 'express';
import controlador from '../controllers/tareaController.js';
import { esAdmin } from '../middlewares/validarRoles.js';
import {validarJWT} from "../middlewares/validarJWT.js";

export const router = (redisClient) => {
    
    const route = Router();
    
    route.get('/', validarJWT, (req, res) => controlador.tareasGet(req, res, redisClient));
    route.get('/asignadas', validarJWT, (req, res) => controlador.tareasGetAsignadas(req, res, redisClient));
    route.get('/asignadas/:id', validarJWT, (req, res) => controlador.tareaGetAsignadaA(req, res, redisClient));
    
    route.put('/estado/:id', validarJWT, (req, res) => controlador.tareaActualizarEstado(req, res, redisClient));
    
    route.post('/', [validarJWT, esAdmin], (req, res) => controlador.addTarea(req, res, redisClient));
    route.put('/:id', [validarJWT, esAdmin], (req, res) => controlador.tareasPut(req, res, redisClient));
    route.delete('/:id', [validarJWT, esAdmin], (req, res) => controlador.tareasDelete(req, res, redisClient));
    
    return route;

}