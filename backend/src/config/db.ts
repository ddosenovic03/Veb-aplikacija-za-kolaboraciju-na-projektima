import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const {
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_NAME
} = process.env;

if (!DB_HOST || !DB_USER || !DB_NAME) {
    throw new Error('Nedostaju obavezne varijable okruženja: DB_HOST, DB_USER, DB_NAME u .env datoteci.');
}

export const db = mysql.createPool({
    host : DB_HOST,
    port : Number(DB_PORT || 3306),
    user : DB_USER,
    password : DB_PASSWORD || '',
    database : DB_NAME,
    connectionLimit : 10,
});