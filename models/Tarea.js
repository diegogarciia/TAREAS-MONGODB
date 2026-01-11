import { Schema, model } from 'mongoose';

const TareaSchema = Schema({
    id: { 
        type: Number, 
        unique: true, 
        required: true 
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    duracion: {
        type: Number, 
        required: true
    },
    dificultad: {
        type: String,
        required: true,
        enum: ['XS', 'S', 'M', 'L', 'XL'] 
    },
    estado: {
        type: String,
        default: 'Todo',
        enum: ['Todo', 'In progress', 'Done'] 
    },
    asignadaA: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario' 
    }
});

export default model('Tarea', TareaSchema);