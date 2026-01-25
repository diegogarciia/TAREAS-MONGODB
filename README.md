# Gestor de Tareas: Node.js + GraphQL + Redis + WebSockets

Este proyecto es una API robusta para la gestión de tareas, diseñada para ser rápida y escalable. Utiliza **Redis** para el almacenamiento en caché de alto rendimiento y **WebSockets** para actualizaciones en tiempo real.

## Tecnologías Utilizadas

* **Backend:** Node.js con Express.
* **Base de Datos:** MongoDB (Mongoose).
* **API:** GraphQL (Apollo Server).
* **Caché:** Redis (Patrón Cache-Aside).
* **Tiempo Real:** Socket.io para comunicación bidireccional.
* **Estilo:** Kleur para logs elegantes en consola.

---

## Estrategia de Caché con Redis

Para optimizar las consultas, implementamos el patrón **Cache-Aside**:

1.  **Lectura:** Al consultar tareas, el sistema busca primero en **Redis**. Si no están, consulta **MongoDB** y guarda el resultado en caché por 60 segundos. 
2.  **Escritura:** Al crear, actualizar o borrar una tarea, se **invalida la caché** automáticamente (`redisClient.del("tareas_cache")`) para garantizar que el usuario siempre vea datos actualizados. 



---

## Instalación y Uso

1.  **Clonar el repositorio:**
    ```bash
    git clone (https://github.com/diegogarciia/TAREAS-MONGODB.git)
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:** Crea un archivo `.env` en la raíz con:
    ```env
    PORT=9090
    DB_URL=tu_url_de_mongodb
    DB_DATABASE=tareasMongoDB
    SECRETORPRIVATEKEY=tu_secreto_jwt
    ```

4.  **Asegúrate de tener Redis corriendo:**
    ```bash
    redis-cli ping # Debería responder PONG
    ```

5.  **Iniciar el servidor:**
    ```bash
    nodemon
    ```

---

## Endpoints Principales

* **GraphQL Playground:** `http://localhost:9090/graphql`
* **Rutas REST de Tareas:** `http://localhost:9090/tasks`
* **Rutas de Auth:** `http://localhost:9090/auth`

---