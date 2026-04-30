const BaseModel = require('./BaseModel');

class Evento extends BaseModel {
    static async findAll() {
        return await this.query('SELECT * FROM eventos ORDER BY fecha_evento DESC');
    }

    static async findDestacados() {
        return await this.query('SELECT * FROM eventos WHERE destacado = TRUE ORDER BY fecha_evento DESC');
    }

    static async findById(id) {
        const rows = await this.query('SELECT * FROM eventos WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(data) {
        const { titulo, descripcion, fecha_evento, hora_evento, lugar, destacado, imagen, imagen2, imagen3 } = data;
        const result = await this.execute(
            'INSERT INTO eventos (titulo, descripcion, fecha_evento, hora_evento, lugar, destacado, imagen, imagen2, imagen3) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [titulo, descripcion, fecha_evento, hora_evento, lugar, destacado || 0, imagen, imagen2, imagen3]
        );
        return result.insertId;
    }

    static async update(id, data) {
        const fields = [];
        const values = [];

        if (data.titulo) { fields.push('titulo = ?'); values.push(data.titulo); }
        if (data.descripcion !== undefined) { fields.push('descripcion = ?'); values.push(data.descripcion); }
        if (data.fecha_evento) { fields.push('fecha_evento = ?'); values.push(data.fecha_evento); }
        if (data.hora_evento !== undefined) { fields.push('hora_evento = ?'); values.push(data.hora_evento); }
        if (data.lugar !== undefined) { fields.push('lugar = ?'); values.push(data.lugar); }
        if (data.destacado !== undefined) { fields.push('destacado = ?'); values.push(data.destacado); }
        if (data.imagen) { fields.push('imagen = ?'); values.push(data.imagen); }
        if (data.imagen2) { fields.push('imagen2 = ?'); values.push(data.imagen2); }
        if (data.imagen3) { fields.push('imagen3 = ?'); values.push(data.imagen3); }

        if (fields.length === 0) return;

        values.push(id);
        const result = await this.execute(`UPDATE eventos SET ${fields.join(', ')} WHERE id = ?`, values);
        return result.affectedRows;
    }

    static async delete(id) {
        const result = await this.execute('DELETE FROM eventos WHERE id = ?', [id]);
        return result.affectedRows;
    }
}

module.exports = Evento;
