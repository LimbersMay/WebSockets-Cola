const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl(); 


const socketController = ( socket ) => {

    socket.emit('ultimo-ticket', ticketControl.ultimo);
    socket.emit('ultimos-4', ticketControl.ultimos4);

    socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
    socket.emit('tickets-pendientes', ticketControl.tickets.length);

    socket.on('siguiente-ticket', ( payload, callback) => {
        
        const siguiente = ticketControl.siguiente();
        callback(siguiente);

        // TODO: Notificar que bay un nuevo ticket pendiente de asignar
        socket.emit('tickets-pendientes', ticketControl.tickets.length);
    });

    socket.on('atender-ticket', ({ escritorio }, callback) => {

        if ( !escritorio ) { 
            return callback({
                ok: false,
                msg: 'El escritorio es necesario'
            })
        }

        const ticket = ticketControl.atenderTicket(escritorio);

        // TODO: Notificar cambio en los últimos 4 tickets del frontend
        socket.broadcast.emit('ultimos-4', ticketControl.ultimos4);

        // Notificar que un ticket ha sido asignado
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
        socket.emit('tickets-pendientes', ticketControl.tickets.length);

        if ( !ticket ) {
            return callback({
                ok: false,
                msg: 'No hay tickets'
            })
        }

        return callback({
            ok: true,
            ticket
        })

    });
}

module.exports = {
    socketController
};
