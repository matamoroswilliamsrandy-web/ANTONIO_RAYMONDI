const BaseModel = require('./BaseModel');

class Ajuste extends BaseModel {
    static async findAll() {
        return await this.query('SELECT clave, valor FROM ajustes_inicio');
    }

    static async update(clave, valor) {
        const result = await this.execute(
            'UPDATE ajustes_inicio SET valor = ? WHERE clave = ?',
            [valor, clave]
        );
        return result.affectedRows;
    }

    static async updateMany(data) {
        for (const [clave, valor] of Object.entries(data)) {
            await this.update(clave, valor);
        }
    }
}

module.exports = Ajuste;
