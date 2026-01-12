import { Schema, model } from 'mongoose';

const UsuarioSchema = Schema({
    id: { 
        type: Number, 
        unique: true, 
        required: true 
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true 
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    rol: {
        type: String,
        required: true,
        default: 'ESTANDAR',
        enum: ['ADMINISTRADOR', 'ESTANDAR'] 
    },
}, { 
    collection: 'usuarios', versionKey: false, strict: false
});

export default model('Usuario', UsuarioSchema);