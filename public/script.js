const enviarConsulta = async (query, variables = {}) => {
    try {
        const response = await fetch('http://localhost:9090/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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