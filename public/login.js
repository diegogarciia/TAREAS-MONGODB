const API_URL = 'http://localhost:9090/graphql';

document.getElementById('btnLogin').addEventListener('click', manejarLogin);

async function manejarLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('mensaje-error');

    const query = `
        mutation Login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
                token
                usuario {
                    id
                    nombre
                    rol
                }
            }
        }
    `;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                query, 
                variables: { email, password } 
            }),
        });

        const result = await response.json();

        if (result.errors) {
            errorDiv.innerText = result.errors[0].message;
        } else if (result.data && result.data.login) {
            localStorage.setItem('token', result.data.login.token);
            
            localStorage.setItem('user_name', result.data.login.usuario.nombre);
            
            localStorage.setItem('user_rol', result.data.login.usuario.rol); 

            window.location.href = 'index.html';
        }
    } catch (err) {
        errorDiv.innerText = "Error de conexión con el servidor";
        console.error(err);
    }

    const result = await response.json();
    console.log('--- Respuesta del Servidor ---');
    console.log(result); 
}