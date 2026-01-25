const enviarConsulta = async (query, variables = {}) => {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('http://localhost:9090/graphql', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            },
            body: JSON.stringify({ query, variables }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en la comunicación:', error);
        return { errors: [{ message: 'No se pudo conectar con el servidor' }] };
    }
};

const mostrarResultado = (data) => {
    const resultadoDiv = document.getElementById('resultado');
    if (data.errors) {
        resultadoDiv.innerHTML = `<span style="color: #ff6b6b;">Error: ${data.errors[0].message}</span>`;
    } else if (!data.data) {
        resultadoDiv.innerHTML = "No se encontraron datos.";
    } else {
        resultadoDiv.innerHTML = `<pre>${JSON.stringify(data.data, null, 2)}</pre>`;
    }
};

const obtenerTareasDificultad = async () => {
    const dif = prompt('Introduce la dificultad (XS, S, M, L, XL):').toUpperCase();
    const query = `
        query GetTareasDif($dif: String) {
            tareas(dificultad: $dif) {
                id
                descripcion
                dificultad
            }
        }
    `;
    const data = await enviarConsulta(query, { dif });
    mostrarResultado(data);
};

const obtenerTareasRango = async () => {
    const query = `
        query {
            tareas {
                descripcion
                dificultad
            }
        }
    `;
    const data = await enviarConsulta(query);
    
    if (data.data && data.data.tareas) {
        const orden = { 'XS': 1, 'S': 2, 'M': 3, 'L': 4, 'XL': 5 };
        data.data.tareas.sort((a, b) => orden[a.dificultad] - orden[b.dificultad]);
    }
    mostrarResultado(data);
};

const contarTareasMaximas = async () => {
    const query = `
        query {
            tareas(dificultad: "XL") {
                id
            }
        }
    `;
    const data = await enviarConsulta(query);
    if (data.data) {
        mostrarResultado({ data: { totalTareasXL: data.data.tareas.length } });
    } else {
        mostrarResultado(data);
    }
};

const obtenerTareasPorPersona = async () => {
    const userId = parseInt(prompt('Introduce el ID del usuario:'));
    if (isNaN(userId)) return alert("ID no válido");
    
    const query = `
        query GetTareasUser($userId: Int!) {
            tareasPorUsuario(userId: $userId) {
                descripcion
                estado
                dificultad
            }
        }
    `;
    const data = await enviarConsulta(query, { userId });
    mostrarResultado(data);
};

const obtenerTareasPersonaFiltradas = async () => {
    const userId = parseInt(prompt('ID del Usuario:'));
    const dif = prompt('Dificultad (XS, S, M, L, XL):').toUpperCase();
    
    const query = `
        query GetTareasUserDif($userId: Int!) {
            tareasPorUsuario(userId: $userId) {
                descripcion
                dificultad
            }
        }
    `;
    const data = await enviarConsulta(query, { userId });
    
    if (data.data && data.data.tareasPorUsuario) {
        data.data.tareasPorUsuario = data.data.tareasPorUsuario.filter(t => t.dificultad === dif);
    }
    mostrarResultado(data);
};

const obtenerTareasSinAsignar = async () => {
    const query = `
        query {
            tareas {
                descripcion
                duracion
                dificultad
                idUsuarioAsignado
            }
        }
    `;
    const data = await enviarConsulta(query);
    
    if (data.data && data.data.tareas) {
        data.data.tareas = data.data.tareas
            .filter(t => !t.idUsuarioAsignado || t.idUsuarioAsignado === 0)
            .sort((a, b) => b.duracion - a.duracion);
    }
    mostrarResultado(data);
};

const obtenerCargaTrabajo = async () => {
    const query = `
        query {
            usuarios {
                nombre
                tareas {
                    duracion
                }
            }
        }
    `;
    const data = await enviarConsulta(query);
    
    if (data.data && data.data.usuarios) {
        const resumen = data.data.usuarios.map(u => ({
            usuario: u.nombre,
            horasTotales: u.tareas.reduce((acc, t) => acc + t.duracion, 0),
            cantidadTareas: u.tareas.length
        }));
        mostrarResultado({ data: { cargaDeTrabajo: resumen } });
    } else {
        mostrarResultado(data);
    }
};

const token = localStorage.getItem('token');

if (!token) {
    window.location.href = 'login.html';
}

const nombreUsuario = localStorage.getItem('user_name');
if (nombreUsuario) {
    console.log(`Bienvenido, ${nombreUsuario}`);
}

document.getElementById('btnLogout').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');

    window.location.href = 'login.html';
});

const socket = io(); 

const actualizarContador = async () => {
    const query = `
        query {
            tareas {
                idUsuarioAsignado
            }
        }
    `;
    const data = await enviarConsulta(query);
    
    if (data.data && data.data.tareas) {
        const sinAsignar = data.data.tareas.filter(t => !t.idUsuarioAsignado || t.idUsuarioAsignado === 0);
        
        const spanContador = document.getElementById('contador-tareas-sin-asignar');
        if (spanContador) {
            spanContador.innerText = `Contador de tareas sin asignar: ${sinAsignar.length}`;
        }
    }
};

socket.on('actualizar-dashboard', () => {
    actualizarContador();
});

actualizarContador();

const rol = localStorage.getItem('user_rol');

if (rol === 'ADMINISTRADOR') {
    const panelAdmin = document.getElementById('controles-admin');
    if (panelAdmin) {
        panelAdmin.style.display = 'block';
    }
}

const generarUsuariosFaker = async () => {
    const query = `
        mutation {
            generarUsuariosAleatorios(cantidad: 10) {
                nombre
                email
            }
        }
    `;
    const data = await enviarConsulta(query);
    mostrarResultado(data);
    socket.emit('notificar-cambio-tareas'); 
};

socket.on('actualizar-dashboard', () => {
    console.log("Actualización recibida por Socket.io");
    actualizarContador();
    
    const resultadoDiv = document.getElementById('resultado');
    if (resultadoDiv.innerText.includes("idUsuarioAsignado: 0")) {
        obtenerTareasSinAsignar();
    }
});

const mostrarFormularioTarea = async () => {
    const descripcion = prompt("Descripción de la tarea:");
    if (!descripcion) return; 

    const duracion = parseInt(prompt("Duración estimada (horas):"));
    const dificultad = prompt("Dificultad (XS, S, M, L, XL):").toUpperCase();

    const query = `
        mutation AgregarTarea($desc: String!, $dur: Int!, $dif: String!) {
            agregarTarea(
                idUsuarioAsignado: 0, 
                descripcion: $desc, 
                duracion: $dur, 
                dificultad: $dif, 
                estado: "por hacer"
            ) {
                descripcion
                estado
            }
        }
    `;

    const variables = { desc: descripcion, dur: duracion, dif: dificultad };
    const data = await enviarConsulta(query, variables);
    
    mostrarResultado(data);

};