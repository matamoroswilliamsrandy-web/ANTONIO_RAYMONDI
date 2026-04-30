const Noticia = require('../models/Noticia');
const { getLocalDateStr } = require('../utils/dateUtils');

exports.getAllNoticias = async (filter = 'all') => {
    let allNoticias = await Noticia.findAll();
    allNoticias.sort((a, b) => new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion));

    if (filter === 'all') return allNoticias;

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

    return allNoticias.filter(n => {
        const newsDateStr = n.fecha_publicacion instanceof Date
            ? n.fecha_publicacion.toISOString().split('T')[0]
            : String(n.fecha_publicacion).substring(0, 10);
        return newsDateStr >= startDateStr && newsDateStr < todayStr;
    });
};

exports.getTopNoticias = async (limit = 3) => {
    const all = await Noticia.findAll();
    return all.slice(0, limit);
};
