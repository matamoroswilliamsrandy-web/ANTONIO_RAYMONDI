const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const Ajuste = require('../models/Ajuste');

router.use(authMiddleware);

// Dashboard
router.get('/', adminController.dashboard);

// Usuarios administradores
router.get('/usuarios', adminController.listarUsuarios);
router.post('/usuarios/crear', adminController.crearUsuario);
router.post('/usuarios/eliminar/:id', adminController.eliminarUsuario);

// ── Noticias ──────────────────────────────────
router.get('/noticias', adminController.listarNoticias);
router.post('/noticias/crear', upload.fields([
    { name: 'imagen', maxCount: 1 },
    { name: 'imagen2', maxCount: 1 },
    { name: 'imagen3', maxCount: 1 }
]), adminController.crearNoticia);
router.get('/noticias/editar/:id', adminController.mostrarEditarNoticia);
router.post('/noticias/editar/:id', upload.fields([
    { name: 'imagen', maxCount: 1 },
    { name: 'imagen2', maxCount: 1 },
    { name: 'imagen3', maxCount: 1 }
]), adminController.editarNoticia);
router.post('/noticias/eliminar/:id', adminController.eliminarNoticia);

// ── Eventos ───────────────────────────────────
router.get('/eventos', adminController.listarEventos);
router.post('/eventos/crear', upload.fields([
    { name: 'imagen', maxCount: 1 },
    { name: 'imagen2', maxCount: 1 },
    { name: 'imagen3', maxCount: 1 }
]), adminController.crearEvento);
router.get('/eventos/editar/:id', adminController.mostrarEditarEvento);
router.post('/eventos/editar/:id', upload.fields([
    { name: 'imagen', maxCount: 1 },
    { name: 'imagen2', maxCount: 1 },
    { name: 'imagen3', maxCount: 1 }
]), adminController.editarEvento);
router.post('/eventos/eliminar/:id', adminController.eliminarEvento);

// ── Autoridades ───────────────────────────────
router.get('/autoridades', adminController.listarAutoridades);
router.post('/autoridades/crear', upload.single('imagen'), adminController.crearAutoridad);
router.get('/autoridades/editar/:id', adminController.mostrarEditarAutoridad);
router.post('/autoridades/editar/:id', upload.single('imagen'), adminController.editarAutoridad);
router.post('/autoridades/eliminar/:id', adminController.eliminarAutoridad);  // ← POST (era GET)

// ── Galería ───────────────────────────────────
router.get('/galeria', adminController.listarGaleria);
router.post('/galeria/subir', upload.single('imagen'), adminController.subirImagenGaleria);
router.post('/galeria/eliminar/:id', adminController.eliminarImagenGaleria);  // ← POST (era GET)

// ── Contacto (mensajes) ───────────────────────
router.get('/contacto', adminController.listarMensajes);
router.post('/contacto/eliminar/:id', adminController.eliminarMensaje);

// ── Ajustes de Inicio (Página Principal) ───────
router.get('/ajustes', adminController.mostrarAjustes);
router.post('/ajustes/guardar', upload.fields([
    { name: 'card1_img', maxCount: 1 },
    { name: 'card2_img', maxCount: 1 },
    { name: 'card3_img', maxCount: 1 },
    { name: 'hist_img1', maxCount: 1 },
    { name: 'mv_mision_img', maxCount: 1 },
    { name: 'mv_vision_img', maxCount: 1 },
    { name: 'pe_img1', maxCount: 1 }
]), adminController.guardarAjustes);

module.exports = router;
