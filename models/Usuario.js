import { Schema, model } from 'mongoose';

const UsuarioSchema = Schema({
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
    operativo: {
        type: Boolean,
        default: true 
    }
}, { 
    versionKey: false 
});

export default model('Usuario', UsuarioSchema);