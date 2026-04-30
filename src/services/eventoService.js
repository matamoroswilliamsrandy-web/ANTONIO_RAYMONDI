const Evento = require('../models/Evento');
const { getLocalDateStr } = require('../utils/dateUtils');

exports.getAllEventos = async (filter = 'all') => {
    let allEventos = await Evento.findAll();
    allEventos.sort((a, b) => new Date(b.fecha_evento) - new Date(a.fecha_evento));

    if (filter === 'all') return allEventos;

    const now = new Date();
    const todayStr = getLocalDateStr(now);
    let startDateStr;

    if (filter === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        startDateStr = getLocalDateStr(weekAgo);
    } else if (filter === 'month') {
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        startDateStr = getLocalDateStr(monthAgo);
    }

    return allEventos.filter(e => {
        const eventDateStr = e.fecha_evento instanceof Date
            ? e.fecha_evento.toISOString().split('T')[0]
            : String(e.fecha_evento).substring(0, 10);
        return eventDateStr >= startDateStr && eventDateStr < todayStr;
    });
};

exports.getDestacados = async () => {
    try {
        return await Evento.findDestacados() || [];
    } catch (err) {
        console.error('Error al obtener eventos destacados:', err);
        return [];
    }
};
