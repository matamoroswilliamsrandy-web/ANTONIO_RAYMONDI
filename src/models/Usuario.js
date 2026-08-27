const BaseModel = require('./BaseModel');

class Usuario extends BaseModel {
    static async findAll() {
        return await this.query('SELECT id, username FROM usuarios ORDER BY username ASC');
    }

    static async findByUsername(username) {
        const rows = await this.query('SELECT * FROM usuarios WHERE username = ?', [username]);
        return rows[0];
    }

    static async create(username, password) {
        const result = await this.execute('INSERT INTO usuarios (username, password) VALUES (?, ?)', [username, password]);
        return result.insertId;
    }

    static async delete(id) {
        const result = await this.execute('DELETE FROM usuarios WHERE id = ?', [id]);
        return result.affectedRows;
    }
}

module.exports = Usuario;
