const multer = require('multer');
const path = require('path');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

let upload;

if (IS_PRODUCTION) {
    // ── PRODUCCIÓN (Railway): guardar en Cloudinary ──────────────────────────
    const cloudinary = require('../config/cloudinary');
    const { CloudinaryStorage } = require('multer-storage-cloudinary');

    const cloudinaryStorage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: (req, file) => ({
            folder: 'antonio-raymondi',
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            transformation: [{ quality: 'auto', fetch_format: 'auto' }],
            public_id: file.fieldname + '-' + Date.now() + '-' + Math.round(Math.random() * 1e9)
        })
    });

    upload = multer({
        storage: cloudinaryStorage,
        limits: { fileSize: 5 * 1024 * 1024 }
    });
} else {
    // ── DESARROLLO (local): guardar en public/uploads/ ───────────────────────
    const diskStorage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/uploads/');
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        }
    });

    upload = multer({
        storage: diskStorage,
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            const filetypes = /jpeg|jpg|png|gif|webp/;
            const mimetype = filetypes.test(file.mimetype);
            const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
            if (mimetype && extname) return cb(null, true);
            cb(new Error('Error: Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'));
        }
    });
}

module.exports = upload;
