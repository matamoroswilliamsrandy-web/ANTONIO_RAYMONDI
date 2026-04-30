const Noticia = require('../models/Noticia');
const Evento = require('../models/Evento');
const Autoridad = require('../models/Autoridad');
const Galeria = require('../models/Galeria');
const Contacto = require('../models/Contacto');
const Ajuste = require('../models/Ajuste');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const publicService = require('../services/publicService');
const noticiaService = require('../services/noticiaService');
const eventoService = require('../services/eventoService');

exports.inicio = catchAsync(async (req, res, next) => {
    const { destacados, eventos, ajustes } = await publicService.getHomeData();
    res.render('public/inicio', {
        title: 'Inicio',
        destacados,
        eventos,
        ajustes,
        path: '/'
    });
});

exports.noticias = catchAsync(async (req, res, next) => {
    const filter = req.query.filter || 'all';
    const noticias = await noticiaService.getAllNoticias(filter);
    const allNews = await noticiaService.getAllNoticias('all');
    const topNews = allNews.slice(0, 3);

    res.render('public/noticias', {
        title: 'Noticias Institucionales',
        noticias,
        topNews,
        allNews,
        path: '/noticias',
        currentFilter: filter,
        currentPage: 0,
        totalPages: 1
    });
});

exports.buscarNoticias = catchAsync(async (req, res, next) => {
    const query = req.query.q;
    if (!query) return res.redirect('/noticias');

    const noticias = await Noticia.search(query);
    const todasNoticias = await noticiaService.getAllNoticias('all');
    const topNews = todasNoticias.slice(0, 4);

    res.render('public/noticias', {
        title: `Resultados para: ${query}`,
        noticias,
        topNews,
        allNews: todasNoticias,
        path: '/noticias',
        searchQuery: query
    });
});

exports.detalleNoticia = catchAsync(async (req, res, next) => {
    const noticia = await Noticia.findById(req.params.id);
    if (!noticia) return next(new AppError('Noticia no encontrada', 404));

    const description = noticia.contenido
        ? noticia.contenido.substring(0, 160).replace(/\n/g, ' ') + '...'
        : 'Lee esta noticia de la IE. Antonio Raymondi.';

    res.render('public/detalle-noticia', {
        title: noticia.titulo,
        description,
        ogImage: noticia.imagen,
        noticia,
        path: '/noticias'
    });
});

exports.detalleEvento = catchAsync(async (req, res, next) => {
    const evento = await Evento.findById(req.params.id);
    if (!evento) return next(new AppError('Evento no encontrado', 404));

    const description = (evento.contenido || evento.descripcion)
        ? (evento.contenido || evento.descripcion).substring(0, 160).replace(/\n/g, ' ') + '...'
        : '¡No te pierdas este evento institucional!';

    res.render('public/detalle-evento', {
        title: evento.titulo,
        description,
        ogImage: evento.imagen,
        evento,
        path: '/eventos'
    });
});

exports.eventos = catchAsync(async (req, res, next) => {
    const filter = req.query.filter || 'all';
    const eventos = await eventoService.getAllEventos(filter);
    const eventosDestacados = await eventoService.getDestacados();

    res.render('public/eventos', {
        title: 'Eventos',
        eventos,
        eventosDestacados,
        path: '/eventos',
        currentFilter: filter
    });
});

exports.autoridades = catchAsync(async (req, res, next) => {
    const autoridades = await Autoridad.findAll() || [];
    autoridades.sort((a, b) => {
        const esDirA = a.cargo.toLowerCase().includes('director');
        const esDirB = b.cargo.toLowerCase().includes('director');
        if (esDirA && !esDirB) return -1;
        if (!esDirA && esDirB) return 1;
        return 0;
    });
    res.render('public/autoridades', { title: 'Autoridades', autoridades, path: '/autoridades' });
});

exports.galeria = catchAsync(async (req, res, next) => {
    const imagenes = await Galeria.findAll();
    res.render('public/galeria', { title: 'Galería', imagenes, path: '/galeria' });
});

exports.contacto = catchAsync(async (req, res, next) => {
    if (req.method === 'POST') {
        const { nombre, email, asunto, mensaje } = req.body;
        if (!nombre || !email || !mensaje) {
            return res.render('public/contacto', {
                title: 'Contacto',
                path: '/contacto',
                error: 'Por favor completa todos los campos obligatorios.',
                success: null
            });
        }
        await Contacto.create({ nombre, email, asunto, mensaje });
        return res.render('public/contacto', {
            title: 'Contacto',
            path: '/contacto',
            error: null,
            success: '¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.'
        });
    }
    res.render('public/contacto', { title: 'Contacto', path: '/contacto', error: null, success: null });
});

exports.historia = catchAsync(async (req, res, next) => {
    const ajustesRaw = await Ajuste.findAll();
    const ajustes = {};
    ajustesRaw.forEach(adj => { ajustes[adj.clave] = adj.valor; });
    res.render('public/historia', { title: 'Historia Institucional', ajustes, path: '/historia' });
});

exports.misionVision = catchAsync(async (req, res, next) => {
    const ajustesRaw = await Ajuste.findAll();
    const ajustes = {};
    ajustesRaw.forEach(adj => { ajustes[adj.clave] = adj.valor; });
    res.render('public/mision-vision', { title: 'Misión y Visión', ajustes, path: '/mision-vision' });
});

exports.propuestaEducativa = catchAsync(async (req, res, next) => {
    const ajustesRaw = await Ajuste.findAll();
    const ajustes = {};
    ajustesRaw.forEach(adj => { ajustes[adj.clave] = adj.valor; });
    res.render('public/propuesta-educativa', { title: 'Propuesta Educativa', ajustes, path: '/propuesta-educativa' });
});
