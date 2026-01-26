import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app/app.js';

let tareaId; 

describe('Ciclo de vida de una Tarea (GraphQL)', () => {

  it('Debería crear una tarea nueva', async () => {
    const mutation = {
      query: `
        mutation {
          agregarTarea(
            idUsuarioAsignado: 0, 
            descripcion: "Tarea de integración", 
            duracion: 20, 
            dificultad: "M"
          ) {
            id
            descripcion
            estado
          }
        }
      `
    };

    const response = await request(app).post('/graphql').send(mutation);

    expect(response.statusCode).toBe(200);
    expect(response.body.data.agregarTarea).not.toBeNull();
    expect(response.body.data.agregarTarea.descripcion).toBe("Tarea de integración");
    
    tareaId = response.body.data.agregarTarea.id;
  });

  it('Debería obtener la tarea por su ID', async () => {
    const query = {
      query: `
        query($id: Int!) {
          tarea(id: $id) {
            id
            descripcion
          }
        }
      `,
      variables: { id: tareaId }
    };

    const response = await request(app).post('/graphql').send(query);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.data.tarea.id).toBe(tareaId);
  });

  it('Debería cambiar el estado a "haciendo"', async () => {
    const mutation = {
      query: `
        mutation($id: Int!, $nuevoEstado: String!) {
          tareaActualizarEstado(id: $id, estado: $nuevoEstado) {
            id
            estado
          }
        }
      `,
      variables: { 
        id: tareaId, 
        nuevoEstado: "haciendo" 
      }
    };

    const response = await request(app).post('/graphql').send(mutation);

    expect(response.statusCode).toBe(200);
    expect(response.body.data.tareaActualizarEstado.estado).toBe('haciendo');
  });

  it('Debería borrar la tarea', async () => {
    const mutation = {
      query: `
        mutation($id: Int!) {
          tareasDelete(id: $id)
        }
      `,
      variables: { id: tareaId }
    };

    const response = await request(app).post('/graphql').send(mutation);

    expect(response.statusCode).toBe(200);
    expect(response.body.data.tareasDelete).toBe(true);
  });
});