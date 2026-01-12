import TareaModel from '../models/Tarea.js';
import UserModel from '../models/Usuario.js'

const controlador = {

    addTarea: async (req, res) => {
        try {
            //const userId = parseInt(req.params.id); //Convertimos el id de la URL a número.
            const { idUsuarioAsignado, descripcion } = req.body; //Extraemos el comentario y el idU del cuerpo de la petición.

            if (!descripcion || descripcion.trim() === "") { //Aunque esta validación sería mejor con express-validator.
                return res.status(400).json({ msg: "La descripción no puede estar vacía" });
            }

            //Verificamos si el usuario existe
            const usuario = await UserModel.findOne({ id: idUsuarioAsignado });

            if (!usuario) {
                console.log('‼️ Usuario no encontrado!');
                return res.status(404).json({ msg: "Usuario no encontrado" });
            }

            //Si el usuario existe creamos el nuevo comentario
            const nuevaTarea = new TareaModel({
                idUsuarioAsignado: idUsuarioAsignado,
                descripcion: descripcion, 
                duracion: 0, 
                dificultad: "0", 
                estado: "0", 
            });

            //Finalmente Guardamos en la base de datos.
            await nuevaTarea.save();

            console.log("🔵 Tarea añadida correctamente:", nuevaTarea);
            res.status(201).json({ msg: "Tarea añadida correctamente", tarea: nuevaTarea });

        } catch (error) {
            console.error("❌ Error al añadir tarea:", error);
            res.status(500).json({ msg: "Error al añadir tarea" });
        }
    },
    tareasGet : async (req, res) => {
        try {
            const tareas = await TareaModel.find();
            if (tareas.length > 0) {
                console.log(tareas)
                console.log('🔵Listado correcto!');
                res.status(200).json(tareas);
            } else {
                console.log('‼️ No hay registros!');
                res.status(200).json({ 'msg': 'No se han encontrado registros' });
            }
        } catch (error) {
            console.error('❌ Error al obtener tareas:', error);
            res.status(500).json({ 'msg': 'Error al obtener tareas' });
        }
    },
    tareasGetAsignadas : async (req, res) => {
        try {
            const tareasPorUsuario = await TareaModel.aggregate([
                {
                    $lookup: { //Unimos la colección 'usuarios' a 'comments'  por los campos indicados.
                        from: 'usuarios',  
                        localField: 'idUsuarioAsignado',
                        foreignField: 'id',
                        as: 'usuario'
                    }
                },
                {
                    $unwind: '$usuario'  //Como usuario es un array después del $lookup, usamos $unwind para convertirlo en un objeto normal.
                },
                {
                    $group: { //Agrupamos los comentarios usando _id: '$usuario.nombre', es decir, cada grupo tendrá el nombre del usuario.
                        _id: '$usuario.nombre',
                        tareas: {
                            $push: { //$push agrega cada comentario dentro del array comentarios.
                                tareaId: '$_id',
                                descripcion: '$descripcion',
                                duracion: '$duracion',
                                dificultad: '$dificultad',
                                estado: '$estado'
                            }
                        }
                    }
                }
            ]);

            console.log(tareasPorUsuario);
            res.status(200).json(tareasPorUsuario);

        } catch (error) {
            console.error('❌ Error al obtener tareas por usuario:', error);
            res.status(500).json({ 'msg': 'Error al obtener tareas' });
        }     
    },
    tareaGetAsignadaA : async (req, res) => {
        try {
            const userId = parseInt(req.params.id);  //Esto es necesario porque al usar $match se pone un poco tiquismiquis con los tipos y req.params.id no es int (que es como está definido).
            const tareasPorUsuario = await TareaModel.aggregate([
                {
                    $match: { //Filtramos por esa id.
                        idUsuarioAsignado: userId
                    }
                },
                {
                    $lookup: { //Unimos la colección 'usuarios' a 'comments'  por los campos indicados.
                        from: 'usuarios',  
                        localField: 'idUsuarioAsignado',
                        foreignField: 'id',
                        as: 'usuario'
                    }
                },
                {
                    $unwind: '$usuario' //Como usuario es un array después del $lookup, usamos $unwind para convertirlo en un objeto normal.
                },
                {
                    $group: { //Agrupamos los comentarios usando _id: '$usuario.nombre', es decir, cada grupo tendrá el nombre del usuario.
                        _id: '$usuario.nombre',
                        tareas: {
                            $push: { //$push agrega cada comentario dentro del array comentarios.
                                tareaId: '$_id',
                                descripcion: '$descripcion',
                                duracion: '$duracion',
                                dificultad: '$dificultad',
                                estado: '$estado'
                            }
                        }
                    }
                }
            ]);

            console.log(tareasPorUsuario);
            res.status(200).json(tareasPorUsuario);

        } catch (error) {
            console.error('❌ Error al obtener tareas por usuario:', error);
            res.status(500).json({ 'msg': 'Error al obtener tareas' });
        }     
    }
}

export default controlador;  //Exportamos el controlador para poder usarlo en las rutas.