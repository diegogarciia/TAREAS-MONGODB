import { Router } from 'express';
import controlador from '../controllers/userController.js'
import { esAdmin } from '../middlewares/validarRoles.js';
import {validarJWT} from "../middlewares/validarJWT.js";

export const router = Router();

router.get('/', controlador.usuariosGet);
router.get('/:id', controlador.usuarioGet);
router.post('/', controlador.usuariosPost); 

router.post('/generar/:cantidad', [validarJWT, esAdmin], controlador.generarUsuariosAleatorios);
router.put('/rol/:id', [validarJWT, esAdmin], controlador.usuariosPutRol);
router.put('/:id', [validarJWT], controlador.usuariosPut);
router.delete('/:id', [validarJWT, esAdmin], controlador.usuariosDelete);