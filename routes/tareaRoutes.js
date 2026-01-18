import { Router } from 'express';
import controlador from '../controllers/tareaController.js';
import { esAdmin } from '../middlewares/validarRoles.js';
import {validarJWT} from "../middlewares/validarJWT.js";

export const router = Router();

//El segundo parámetro (optativo) son los middlewares.
router.get('/', validarJWT, controlador.tareasGet);
router.get('/asignadas', validarJWT, controlador.tareasGetAsignadas);
router.get('/asignadas/:id', validarJWT, controlador.tareaGetAsignadaA);

router.put('/estado/:id', validarJWT, controlador.tareaActualizarEstado);

router.post('/', [esAdmin], validarJWT, controlador.addTarea);
router.put('/:id', [esAdmin], validarJWT, controlador.tareasPut);
router.delete('/:id', [esAdmin], validarJWT, controlador.tareasDelete);