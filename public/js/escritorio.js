
// Referencias HTML
const lblEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlerta = document.querySelector('.alert');

const lblTicketsPendientes = document.querySelector('#lblPendientes');

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')) {
    window.location = 'index.html';
    throw new Error('El escritorio es necesario');
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio;

divAlerta.style.display = 'none';


const socket = io();

socket.on('connect', () => {
    btnAtender.disabled = false;
});

socket.on('disconnect', () => {
    btnAtender.disabled = true;
});

socket.on('tickets-pendientes', (ticketsPendientes) => {

    if ( ticketsPendientes === 0 ) {
        lblTicketsPendientes.style.display = 'none';
    }

    lblTicketsPendientes.style.display = '';
    lblTicketsPendientes.innerText = ticketsPendientes;
});

btnAtender.addEventListener('click', () => {

    socket.emit('atender-ticket', { escritorio }, ({ ok, ticket }) => {

        if ( !ok ) {
            lblTicket.innerText = 'Nadie.';
            return divAlerta.style.display = '';
        }

        lblTicket.innerText = `Ticket ${ ticket.numero }`;
    });

    // socket.emit('siguiente-ticket', null, ( ticket ) => {
    //     lblNuevoTicket.innerText = ticket;
    // });
});
