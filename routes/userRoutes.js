import { Router } from 'express';
import controlador from '../controllers/userController.js'
import { esAdmin } from '../middlewares/validarRoles.js';

export const router = Router();

//El segundo parámetro (optativo) son los middlewares.
router.get('/', controlador.usuariosGet);
router.get('/:id', controlador.usuarioGet);
router.post('/', controlador.usuariosPost); 

router.post('/generar/:cantidad', [esAdmin], controlador.generarUsuariosAleatorios);
router.put('/rol/:id', [esAdmin], controlador.usuariosPutRol);
router.put('/:id', controlador.usuariosPut);
router.delete('/:id', [esAdmin], controlador.usuariosDelete);