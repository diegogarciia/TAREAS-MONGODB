import TareaModel from '../models/Tarea.js';
import UserModel from '../models/Usuario.js'

const controlador = {

    addTarea: async (req, res) => {
        try {
            const { idUsuarioAsignado, descripcion, duracion, dificultad, estado } = req.body; 

            const ultimaTarea = await TareaModel.findOne().sort('-id');
            const nuevoId = ultimaTarea ? ultimaTarea.id + 1 : 1;

            if (!descripcion || descripcion.trim() === "") { 
                return res.status(400).json({ msg: "La descripción no puede estar vacía" });
            }

            const usuario = await UserModel.findOne({ id: idUsuarioAsignado });

            if (!usuario) {
                console.log('‼️ Usuario no encontrado!');
                return res.status(404).json({ msg: "Usuario no encontrado" });
            }

            const nuevaTarea = new TareaModel({
                id: nuevoId,
                idUsuarioAsignado: idUsuarioAsignado,
                descripcion: descripcion, 
                duracion: duracion, 
                dificultad: dificultad, 
                estado: estado, 
            });

            await nuevaTarea.save();

            console.log("🔵 Tarea añadida correctamente:", nuevaTarea);
            res.status(201).json({ msg: "Tarea añadida correctamente", tarea: nuevaTarea });

            req.app.get('socketio').emit('actualizar-dashboard');

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
                    $lookup: { 
                        from: 'usuarios',  
                        localField: 'idUsuarioAsignado',
                        foreignField: 'id',
                        as: 'usuario'
                    }
                },
                {
                    $unwind: '$usuario'  
                },
                {
                    $group: { 
                        _id: '$usuario.nombre',
                        tareas: {
                            $push: {
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
            const userId = parseInt(req.params.id);  
            const tareasPorUsuario = await TareaModel.aggregate([
                {
                    $match: { //Filtramos por esa id.
                        idUsuarioAsignado: userId
                    }
                },
                {
                    $lookup: { 
                        from: 'usuarios',  
                        localField: 'idUsuarioAsignado',
                        foreignField: 'id',
                        as: 'usuario'
                    }
                },
                {
                    $unwind: '$usuario' 
                },
                {
                    $group: { 
                        _id: '$usuario.nombre',
                        tareas: {
                            $push: { 
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
    tareasPut : async (req, res) => {
        const { idUsuarioAsignado, descripcion, duracion, dificultad, estado } = req.body;

        try {
            const tareaActualizada = await TareaModel.findOneAndUpdate({id : req.params.id}, req.body, { new: true }); 
            if (tareaActualizada) {
                console.log('🔵 Tarea actualizada correctamente!');
                res.status(200).json(tareaActualizada);
            } else {
                console.log('‼️ Tarea no encontrada!');
                res.status(404).json({ 'msg': 'Tarea no encontrada' });
            }
        } catch (error) {
            console.error('❌ Error al actualizar tarea:', error);
            res.status(500).json({ 'msg': 'Error al actualizar tarea' });
        }
    },
    tareaActualizarEstado: async (req, res) => {
        try {
            const { estado } = req.body;

            const filtro = { 
                id: req.params.id, 
                asignadaA: req.usuario._id 
            };

            const tareaActualizada = await TareaModel.findOneAndUpdate(
                filtro, 
                { estado }, 
                { new: true, runValidators: true }
            );

            if (!tareaActualizada) return res.status(403).json({ msg: "No autorizado o tarea no encontrada" });
            res.status(200).json(tareaActualizada);
        } catch (error) {
            res.status(500).json({ msg: "Error al actualizar estado" });
        }
    },
    tareasDelete : async (req, res) => {

        try {
            const tareaEliminada = await TareaModel.deleteOne({id:req.params.id});
            if (tareaEliminada.deletedCount > 0) {
                console.log('🔵 Tarea eliminada correctamente!');
                res.status(200).json(tareaEliminada);
            } else {
                console.log('‼️ Tarea no encontrada!');
                res.status(404).json({ 'msg': 'Tarea no encontrada' });
            }
        } catch (error) {
            console.error('❌ Error al eliminar tarea:', error);
            res.status(500).json({ 'msg': 'Error al eliminar tarea' });
        }
    }
    
}

export default controlador; 