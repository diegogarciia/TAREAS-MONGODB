import { Router } from 'express';
import controlador from '../controllers/tareaController.js';
export const router = Router();

//El segundo parámetro (optativo) son los middlewares.
router.get('/', controlador.tareasGet);
router.get('/asignadas', controlador.tareasGetAsignadas);
router.get('/asignadas/:id', controlador.tareaGetAsignadaA);
router.post('/', controlador.addTarea);
router.put('/:id', controlador.tareasPut);
router.delete('/:id', controlador.tareasDelete);