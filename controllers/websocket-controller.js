import kleur from 'kleur';

export const socketController = (socket, io) => {
    console.log(kleur.cyan("Cliente conectado:"), socket.id);

    socket.on('notificar-cambio-tareas', () => {
        io.emit('actualizar-dashboard');
        console.log(kleur.yellow("Evento 'actualizar-dashboard' emitido a todos los clientes."));
    });

    socket.on("disconnect", () => {
        console.log(kleur.gray("Monitor desconectado"), socket.id);
    });
};