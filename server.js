const app = require('./app');
const config = require('./src/config/appConfig');

const port = app.get('port');

app.listen(port, () => {
    console.log(`🚀 Servidor [${config.env}] corriendo en http://localhost:${port}`);
});
