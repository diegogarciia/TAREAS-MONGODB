import TareaModel from '../models/Tarea.js';

const controlador = {

    tareasGet : async (req, res) => {
        try {
            const tareas = await TareaModel.find().lean();
            //const personas = await UserModel.find();  //Sin .lean() devuelve documentos de Mongoose, con .lean() devuelve objetos JS puros. Al ser datos más ligeros, mejora el rendimiento en lecturas ya que no se necesitan las funcionalidades de JSON.stringify que son llamadas automáticamente al enviar la respuesta.
            
            if (tareas.length > 0) {
                console.log(tareas)
                console.log('🔵 Listado correcto!');
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
    tareaGet : async (req, res) => {

        try {
            const tarea = await TareaModel.find({id: req.params.id});
            if (tarea.length > 0)  {
                console.log('🔵 Tarea encontrada!');
                res.status(200).json(tarea);
            } else {
                console.log('‼️ Tarea no encontrada!');
                res.status(404).json({ 'msg': 'Tarea no encontrada' });
            }
        } catch (error) {
            console.error('❌ Error al obtener tarea por ID:', error);
            res.status(500).json({ 'msg': 'Error al obtener tarea por ID' });
        }
    },
    tareasPost : async (req, res) => {
        const { id, descripcion, duracion, dificultad, estado, asignadaA } = req.body;

        try {
            //En lugar de body podemos usar los campos, para un mayor control y coherencia. También podremos combinar con validator y middlewares.
            // UserModel.create({ id, nombre, edad, tfno }  , (err, usuario) => {
            
            const tarea = await TareaModel.create(req.body);

            console.log('🔵 Tarea registrada correctamente!');
            res.status(201).json(tarea);

            //O también...
            //const nuevoUsuario = new UserModel({ id, nombre, edad, tfno });
            //await nuevoUsuario.save();
            //console.log('Usuario registrado correctamente!');
            //res.status(201).json(nuevoUsuario);
        } catch (error) {
            console.error('❌ Error al registrar usuario:', error);
            res.status(500).json({ 'msg': 'Error al registrar usuario' });
        }
    },
    tareasPut : async (req, res) => {
        const { descripcion, duracion, dificultad, estado, asignadaA } = req.body;

        try {
            //const usuarioActualizado = await UserModel.updateOne({id : req.params.id}, { nombre, edad, tfno });
            const tareaActualizada = await TareaModel.findOneAndUpdate({id : req.params.id}, req.body, { new: true }); //{ new: true }   <-- Devuelve el documento actualizado
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

export default controlador;  //Exportamos el controlador para poder usarlo en las rutas.