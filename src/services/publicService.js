const Ajuste = require('../models/Ajuste');
const Noticia = require('../models/Noticia');
const Evento = require('../models/Evento');

exports.getHomeData = async () => {
    let noticiasDestacadas = [];
    let eventosDestacados = [];

    try {
        noticiasDestacadas = await Noticia.findDestacadas() || [];
    } catch (err) {
        console.error('Error al obtener noticias destacadas:', err);
    }

    if (noticiasDestacadas.length === 0) {
        try {
            const todasNoticias = await Noticia.findAll() || [];
            noticiasDestacadas = todasNoticias.slice(0, 3);
        } catch (err) {
            console.error('Error al obtener noticias de fallback:', err);
        }
    }

    try {
        eventosDestacados = await Evento.findDestacados() || [];
    } catch (err) {
        console.error('Error al obtener eventos destacados:', err);
    }

    const destacados = [
        ...noticiasDestacadas.map(n => ({ ...n, tipo: 'noticia' })),
        ...eventosDestacados.map(e => ({ ...e, tipo: 'evento' }))
    ];

    destacados.sort((a, b) => {
        const fechaA = new Date(a.tipo === 'noticia' ? (a.fecha_publicacion || a.created_at) : (a.fecha_evento || a.created_at));
        const fechaB = new Date(b.tipo === 'noticia' ? (b.fecha_publicacion || b.created_at) : (b.fecha_evento || b.created_at));
        return fechaB - fechaA;
    });

    const eventos = await Evento.findAll();
    const ajustesRaw = await Ajuste.findAll();
    
    const ajustes = {};
    ajustesRaw.forEach(adj => {
        ajustes[adj.clave] = adj.valor;
    });

    return { destacados, eventos, ajustes };
};
