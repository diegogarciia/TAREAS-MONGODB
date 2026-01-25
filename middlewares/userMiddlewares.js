export const esAdmin = (req, res, next) => {
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se requiere validar el token antes de verificar el rol'
        });
    }

    const { rol, nombre } = req.usuario;

    if (rol !== 'ADMINISTRADOR') {
        return res.status(401).json({
            msg: `${nombre} no es administrador - Acción denegada`
        });
    }

    next(); 
}