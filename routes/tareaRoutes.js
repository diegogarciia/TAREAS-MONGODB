import { Router } from 'express';
import controlador from '../controllers/tareaController.js';
import { esAdminRol } from '../middlewares/validar-roles.js';

export const router = Router();

//El segundo parámetro (optativo) son los middlewares.
router.get('/', controlador.tareasGet);
router.get('/asignadas', controlador.tareasGetAsignadas);
router.get('/asignadas/:id', controlador.tareaGetAsignadaA);

router.put('/estado/:id', controlador.tareaActualizarEstado);

router.post('/', [esAdminRol], controlador.addTarea);
router.put('/:id', [esAdminRol], controlador.tareasPut);
router.delete('/:id', [esAdminRol], controlador.tareasDelete);