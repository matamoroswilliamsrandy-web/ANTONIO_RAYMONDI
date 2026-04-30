const Noticia = require('../models/Noticia');
const Evento = require('../models/Evento');
const Autoridad = require('../models/Autoridad');
const Galeria = require('../models/Galeria');
const Contacto = require('../models/Contacto');

exports.getDashboardStats = async () => {
    const [noticias, eventos, autoridades, imagenes, mensajes] = await Promise.all([
        Noticia.findAll(),
        Evento.findAll(),
        Autoridad.findAll(),
        Galeria.findAll(),
        Contacto.findAll()
    ]);

    return {
        totalNoticias: noticias.length,
        totalEventos: eventos.length,
        totalAutoridades: autoridades.length,
        totalImagenes: imagenes.length,
        totalMensajes: mensajes.length,
        ultimasNoticias: noticias.slice(0, 5),
        proximosEventos: eventos.slice(0, 5),
    };
};
