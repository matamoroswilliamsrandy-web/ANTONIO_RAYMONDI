const config = require('../config/appConfig');

/**
 * Synchronous error handler for 404 routes.
 */
exports.notFound = (req, res, next) => {
    // Render a simple inline 404 to avoid needing DB data
    res.status(404).send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>404 - Página no encontrada | IE. Antonio Raymondi</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f5f6fa; }
                .box { text-align: center; padding: 60px 40px; background: white; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); max-width: 480px; }
                h1 { font-size: 5rem; color: #c0392b; font-weight: 900; }
                h2 { font-size: 1.5rem; color: #333; margin: 10px 0 20px; }
                p { color: #666; margin-bottom: 30px; line-height: 1.6; }
                a { background: #c0392b; color: white; padding: 12px 30px; border-radius: 50px; text-decoration: none; font-weight: 700; }
            </style>
        </head>
        <body>
            <div class="box">
                <h1>404</h1>
                <h2>Página no encontrada</h2>
                <p>La página que buscas no existe o fue movida.</p>
                <a href="/">← Volver al inicio</a>
            </div>
        </body>
        </html>
    `);
};

/**
 * Centralized error handling middleware.
 */
exports.errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (config.env === 'development') {
        sendErrorDev(err, res);
    } else {
        sendErrorProd(err, res);
    }
};

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
    console.error('ERROR 💥', err);

    // Render a simple inline error page to avoid EJS variable dependency issues
    const statusCode = err.isOperational ? err.statusCode : 500;
    const message = err.isOperational
        ? err.message
        : 'Algo salió mal. Por favor, inténtelo de nuevo más tarde.';

    res.status(statusCode).send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Error ${statusCode} | IE. Antonio Raymondi</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f5f6fa; }
                .box { text-align: center; padding: 60px 40px; background: white; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); max-width: 480px; }
                h1 { font-size: 5rem; color: #c0392b; font-weight: 900; }
                h2 { font-size: 1.5rem; color: #333; margin: 10px 0 20px; }
                p { color: #666; margin-bottom: 30px; line-height: 1.6; }
                a { background: #c0392b; color: white; padding: 12px 30px; border-radius: 50px; text-decoration: none; font-weight: 700; }
            </style>
        </head>
        <body>
            <div class="box">
                <h1>${statusCode}</h1>
                <h2>Error del servidor</h2>
                <p>${message}</p>
                <a href="/">← Volver al inicio</a>
            </div>
        </body>
        </html>
    `);
};
