const db = require('../config/database');

class BaseModel {
    static async query(sql, params = []) {
        try {
            const [rows] = await db.execute(sql, params);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async execute(sql, params = []) {
        try {
            const [result] = await db.execute(sql, params);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = BaseModel;
