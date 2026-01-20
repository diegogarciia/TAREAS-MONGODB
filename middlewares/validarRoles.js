export const esAdmin = (req, res, next) => {
    if (!req.roles.includes('ADMINISTRADOR')){ 
        return res.status(500).json({'msg':'No es posible el acceso como administrador.'})
    }
    console.log(req.dniToken + " accediendo como administrador...")
    next()
}

export const esEstandar = (req, res, next) => {
    console.log(req.roles)
    if (!req.roles.includes('ESTANDAR')){ 
        return res.status(500).json({'msg':'No es posible el acceso como usuario estandar.'})
    }
    console.log(req.dniToken + " accediendo como usuario estandar...")
    next()
}