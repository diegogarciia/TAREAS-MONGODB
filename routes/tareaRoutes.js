import { Router } from 'express';
import controlador from '../controllers/tareaController.js';
import { esAdmin } from '../middlewares/validarRoles.js';
import {validarJWT} from "../middlewares/validarJWT.js";

export const router = Router();

router.get('/', validarJWT, controlador.tareasGet);
router.get('/asignadas', validarJWT, controlador.tareasGetAsignadas);
router.get('/asignadas/:id', validarJWT, controlador.tareaGetAsignadaA);

router.put('/estado/:id', validarJWT, controlador.tareaActualizarEstado);

router.post('/', [validarJWT, esAdmin], controlador.addTarea);
router.put('/:id', [validarJWT, esAdmin], controlador.tareasPut);
router.delete('/:id', [validarJWT, esAdmin], controlador.tareasDelete);