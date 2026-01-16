import { Router } from 'express';
import controlador from '../controllers/userController.js'
export const router = Router();

//El segundo parámetro (optativo) son los middlewares.
router.get('/', controlador.usuariosGet);
router.get('/:id', controlador.usuarioGet);
router.post('/', controlador.usuariosPost); 

router.post('/generar/:cantidad', [esAdminRol], controlador.generarUsuariosAleatorios);
router.put('/rol/:id', [esAdminRol], controlador.usuariosPutRol);
router.put('/:id', controlador.usuariosPut);
router.delete('/:id', [esAdminRol], controlador.usuariosDelete);