const Noticia = require('../models/Noticia');
const Evento = require('../models/Evento');
const Autoridad = require('../models/Autoridad');
const Galeria = require('../models/Galeria');
const Contacto = require('../models/Contacto');
const Ajuste = require('../models/Ajuste');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const adminService = require('../services/adminService');

exports.dashboard = catchAsync(async (req, res, next) => {
    const stats = await adminService.getDashboardStats();
    res.render('admin/dashboard', { usuario: req.session.usuario, stats });
});

exports.listarNoticias = catchAsync(async (req, res, next) => {
    const noticias = await Noticia.findAll();
    res.render('admin/noticias', { noticias, error: null, success: null });
});

exports.crearNoticia = catchAsync(async (req, res, next) => {
    const { titulo, contenido, destacada } = req.body;
    if (!titulo?.trim() || !contenido?.trim()) {
        const noticias = await Noticia.findAll();
        return res.render('admin/noticias', { noticias, error: 'Todos los campos son obligatorios.', success: null });
    }
    const imagen = req.files['imagen'] ? '/uploads/' + req.files['imagen'][0].filename : null;
    const imagen2 = req.files['imagen2'] ? '/uploads/' + req.files['imagen2'][0].filename : null;
    const imagen3 = req.files['imagen3'] ? '/uploads/' + req.files['imagen3'][0].filename : null;
    await Noticia.create({ titulo: titulo.trim(), contenido: contenido.trim(), imagen, imagen2, imagen3, destacada: !!destacada });
    res.redirect('/panel-director/noticias?success=1&msg=La noticia ha sido publicada con éxito.');
});

exports.mostrarEditarNoticia = catchAsync(async (req, res, next) => {
    const noticia = await Noticia.findById(req.params.id);
    if (!noticia) return next(new AppError('Noticia no encontrada', 404));
    res.render('admin/editar-noticia', { noticia, error: null });
});

exports.editarNoticia = catchAsync(async (req, res, next) => {
    const { titulo, contenido, destacada } = req.body;
    if (!titulo?.trim()) {
        const noticia = await Noticia.findById(req.params.id);
        return res.render('admin/editar-noticia', { noticia, error: 'El título es obligatorio.' });
    }
    const updateData = { titulo: titulo.trim(), contenido: contenido.trim(), destacada: !!destacada };
    if (req.files['imagen']) updateData.imagen = '/uploads/' + req.files['imagen'][0].filename;
    if (req.files['imagen2']) updateData.imagen2 = '/uploads/' + req.files['imagen2'][0].filename;
    if (req.files['imagen3']) updateData.imagen3 = '/uploads/' + req.files['imagen3'][0].filename;
    await Noticia.update(req.params.id, updateData);
    res.redirect('/panel-director/noticias?success=1&msg=La noticia ha sido actualizada.');
});

exports.eliminarNoticia = catchAsync(async (req, res, next) => {
    await Noticia.delete(req.params.id);
    res.redirect('/panel-director/noticias?success=1&msg=La noticia ha sido eliminada correctamente.');
});

exports.listarEventos = catchAsync(async (req, res, next) => {
    const eventos = await Evento.findAll();
    res.render('admin/eventos', { eventos, error: null });
});

exports.crearEvento = catchAsync(async (req, res, next) => {
    const { titulo, descripcion, fecha_evento, hora_evento, lugar, destacado } = req.body;
    if (!titulo?.trim() || !fecha_evento) {
        const eventos = await Evento.findAll();
        return res.render('admin/eventos', { eventos, error: 'Título y fecha son obligatorios.' });
    }
    const imagen = req.files['imagen'] ? '/uploads/' + req.files['imagen'][0].filename : null;
    const imagen2 = req.files['imagen2'] ? '/uploads/' + req.files['imagen2'][0].filename : null;
    const imagen3 = req.files['imagen3'] ? '/uploads/' + req.files['imagen3'][0].filename : null;
    await Evento.create({ titulo: titulo.trim(), descripcion, fecha_evento, hora_evento, lugar, imagen, imagen2, imagen3, destacado: !!destacado });
    res.redirect('/panel-director/eventos?success=1&msg=El evento ha sido creado con éxito.');
});

exports.mostrarEditarEvento = catchAsync(async (req, res, next) => {
    const evento = await Evento.findById(req.params.id);
    if (!evento) return next(new AppError('Evento no encontrado', 404));
    res.render('admin/editar-evento', { evento, error: null });
});

exports.editarEvento = catchAsync(async (req, res, next) => {
    const { titulo, descripcion, fecha_evento, hora_evento, lugar, destacado } = req.body;
    if (!titulo?.trim()) {
        const evento = await Evento.findById(req.params.id);
        return res.render('admin/editar-evento', { evento, error: 'El título es obligatorio.' });
    }
    const updateData = { titulo: titulo.trim(), descripcion, fecha_evento, hora_evento, lugar, destacado: !!destacado };
    if (req.files['imagen']) updateData.imagen = '/uploads/' + req.files['imagen'][0].filename;
    if (req.files['imagen2']) updateData.imagen2 = '/uploads/' + req.files['imagen2'][0].filename;
    if (req.files['imagen3']) updateData.imagen3 = '/uploads/' + req.files['imagen3'][0].filename;
    await Evento.update(req.params.id, updateData);
    res.redirect('/panel-director/eventos?success=1&msg=El evento ha sido actualizado.');
});

exports.eliminarEvento = catchAsync(async (req, res, next) => {
    await Evento.delete(req.params.id);
    res.redirect('/panel-director/eventos?success=1&msg=El evento ha sido eliminado correctamente.');
});

exports.listarAutoridades = catchAsync(async (req, res, next) => {
    const autoridades = await Autoridad.findAll();
    res.render('admin/autoridades', { autoridades, error: null });
});

exports.crearAutoridad = catchAsync(async (req, res, next) => {
    const { nombre, cargo, orden } = req.body;
    if (!nombre?.trim() || !cargo?.trim()) {
        const autoridades = await Autoridad.findAll();
        return res.render('admin/autoridades', { autoridades, error: 'Nombre y cargo son obligatorios.' });
    }
    const imagen = req.file ? '/uploads/' + req.file.filename : null;
    await Autoridad.create({ nombre: nombre.trim(), cargo: cargo.trim(), imagen, orden });
    res.redirect('/panel-director/autoridades?success=1&msg=La autoridad ha sido registrada con éxito.');
});

exports.mostrarEditarAutoridad = catchAsync(async (req, res, next) => {
    const autoridad = await Autoridad.findById(req.params.id);
    if (!autoridad) return next(new AppError('Autoridad no encontrada', 404));
    res.render('admin/editar-autoridad', { autoridad, error: null });
});

exports.editarAutoridad = catchAsync(async (req, res, next) => {
    const { nombre, cargo, orden } = req.body;
    if (!nombre?.trim()) {
        const autoridad = await Autoridad.findById(req.params.id);
        return res.render('admin/editar-autoridad', { autoridad, error: 'El nombre es obligatorio.' });
    }
    const imagen = req.file ? '/uploads/' + req.file.filename : null;
    await Autoridad.update(req.params.id, { nombre: nombre.trim(), cargo: cargo.trim(), imagen, orden });
    res.redirect('/panel-director/autoridades?success=1&msg=La autoridad ha sido actualizada.');
});

exports.eliminarAutoridad = catchAsync(async (req, res, next) => {
    await Autoridad.delete(req.params.id);
    res.redirect('/panel-director/autoridades?success=1&msg=La autoridad ha sido eliminada.');
});

exports.listarGaleria = catchAsync(async (req, res, next) => {
    const imagenes = await Galeria.findAll();
    res.render('admin/galeria', { imagenes, error: null });
});

exports.subirImagenGaleria = catchAsync(async (req, res, next) => {
    const { titulo } = req.body;
    const imagen = req.file ? '/uploads/' + req.file.filename : null;
    if (!imagen) {
        const imagenes = await Galeria.findAll();
        return res.render('admin/galeria', { imagenes, error: 'Debe seleccionar una imagen para subir.' });
    }
    await Galeria.create(titulo, imagen);
    res.redirect('/panel-director/galeria?success=1&msg=La imagen ha sido subida con éxito.');
});

exports.eliminarImagenGaleria = catchAsync(async (req, res, next) => {
    await Galeria.delete(req.params.id);
    res.redirect('/panel-director/galeria?success=1&msg=La imagen ha sido eliminada.');
});

exports.listarMensajes = catchAsync(async (req, res, next) => {
    const mensajes = await Contacto.findAll();
    res.render('admin/contacto', { mensajes, error: null });
});

exports.eliminarMensaje = catchAsync(async (req, res, next) => {
    await Contacto.delete(req.params.id);
    res.redirect('/panel-director/contacto?success=1&msg=El mensaje ha sido eliminado correctamente.');
});

exports.mostrarAjustes = catchAsync(async (req, res, next) => {
    const ajustes = await Ajuste.findAll();
    res.render('admin/ajustes', { ajustes, success: null, error: null });
});

exports.guardarAjustes = catchAsync(async (req, res, next) => {
    const data = { ...req.body };
    if (req.files) {
        const fields = ['hist_img1', 'mv_mision_img', 'mv_vision_img', 'pe_img1'];
        fields.forEach(field => {
            if (req.files[field]) data[field] = '/uploads/' + req.files[field][0].filename;
        });
    }
    await Ajuste.updateMany(data);
    res.redirect('/panel-director/ajustes?success=1&msg=Los ajustes se han actualizado correctamente.');
});
