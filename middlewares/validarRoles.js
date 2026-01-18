//Si a este middleware lo llamamos después del middleware en el que validamos el JWT (ver middleware), podemos acceder a la variable que 
//almacenamos en req (req.dniToken). Y podríamos acceder a la bd para ver si ese usuario es admin o no.
export const esAdmin = (req, res, next) => {
    if (!req.dniToken){ //Hacemos una comprobación rutinaria de si se ha establecido.
        return res.status(500).json({'msg':'No es posible el acceso como administrador.'})
    }
    
    //Aquí iría la consulta a la bd para ver los roles del usuario. O si se sacó toda la información en el middleware anterior, podríamos hacer algo como esto:
    // if (req.rol == 1){  }
    console.log(req.dniToken + " accediendo como administrador.")
    next();
}