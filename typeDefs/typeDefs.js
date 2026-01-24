import { gql } from 'graphql-tag';

const typeDefs = gql`

  type Usuario {
    id: Int!
    nombre: String!
    email: String!
    rol: String!
  }

  type Tarea {
    id: Int!
    idUsuarioAsignado: Int!
    descripcion: String!
    duracion: Int!
    dificultad: String!
    estado: String
    usuario: Usuario
  }

  type Query {
    usuarios: [Usuario]
    usuario(id: Int!): Usuario
    tareas: [Tarea]
    tarea(id: Int!): Tarea
    tareasPorUsuario(userId: Int!): [Tarea]
  }

  type Mutation {    
    usuariosPost(
      id: Int!, 
      nombre: String!, 
      email: String!, 
      password: String!, 
      rol: String
    ): Usuario

    generarUsuariosAleatorios(cantidad: Int): [Usuario]

    usuariosDelete(id: Int!): Boolean

    agregarTarea(
      idUsuarioAsignado: Int!, 
      descripcion: String!, 
      duracion: Int!, 
      dificultad: String!, 
      estado: String
    ): Tarea

    tareasDelete(id: Int!): Boolean

    tareaActualizarEstado(id: Int!, estado: String!): Tarea
  }
`;

export default typeDefs