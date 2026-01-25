import TareaModel from '../models/Tarea.js';
import UserModel from '../models/Usuario.js'

const controlador = {
    
    addTarea: async (req, res, redisClient) => { 
        
        try {
            const { idUsuarioAsignado, descripcion, duracion, dificultad, estado } = req.body; 
            
            const ultimaTarea = await TareaModel.findOne().sort('-id');
            const nuevoId = ultimaTarea ? ultimaTarea.id + 1 : 1;
            
            if (!descripcion || descripcion.trim() === "") { 
                return res.status(400).json({ msg: "La descripción no puede estar vacía" });
            }
            
            const usuarioExiste = await UserModel.findOne({ id: idUsuarioAsignado });
            
            if (!usuarioExiste) {
                return res.status(404).json({ msg: "Usuario no encontrado" });
            }
            
            const nuevaTarea = new TareaModel({
                id: nuevoId,
                idUsuarioAsignado,
                descripcion, 
                duracion, 
                dificultad, 
                estado: estado || 'por hacer', 
            });
            
            await nuevaTarea.save();
            console.log('🔵 Tarea guardada en MongoDB');
            
            if (redisClient) {
                await redisClient.del("tareas"); 
                console.log('🧹 Caché de Redis eliminada');
            }
            
            const io = req.app.get('socketio');
            
            if (io) io.emit('actualizar-dashboard');
            
            res.status(201).json({ msg: "Tarea añadida correctamente", tarea: nuevaTarea });
        
        } catch (error) {
            console.error("❌ Error al añadir tarea:", error);
            res.status(500).json({ msg: "Error al añadir tarea" });
        }
    },
    tareasGet: async (req, res, redisClient) => {
        try {
            const cachedTasks = await redisClient.get("tareas");
            
            if (cachedTasks) {
                console.log("Cache de tareas usado");
                return res.status(200).json(JSON.parse(cachedTasks));
            }
            
            const tareas = await TareaModel.find();
            
            if (tareas.length > 0) {
                await redisClient.setEx("tareas", 60, JSON.stringify(tareas));
                
                console.log('🔵 Tareas obtenidas de la BD y guardadas en caché');
                res.status(200).json(tareas);
            } else {
                res.status(200).json({ 'msg': 'No se han encontrado registros' });
            }
        } catch (error) {
            console.error('❌ Error:', error);
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
    tareaActualizarEstado: async (req, res, redisClient) => {
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
            await redisClient.del("tareas"); 
            res.status(200).json(tareaActualizada);
        } catch (error) {
            res.status(500).json({ msg: "Error al actualizar estado" });
        }
    },
    tareasDelete : async (req, res) => {

        try {
            const tareaEliminada = await TareaModel.deleteOne({id:req.params.id});
            if (tareaEliminada.deletedCount > 0) {
                await redisClient.del("tareas");
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