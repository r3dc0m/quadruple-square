import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();
const DB_NAME = process.env.DB_NAME || "quadruple";
const DB_USER = process.env.DB_USER || "user";
const DB_PASS = process.env.DB_PASS || "1234";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT || 5432;

const sequelize = new Sequelize(
    DB_NAME,
    DB_USER,
    DB_PASS,
    {
        host: DB_HOST,
        port: DB_PORT,
        dialect: "postgres"
    }
)

export async function checkDB() {
    try {
        await sequelize.authenticate()
        console.log(`Database connected on ${DB_HOST}:${DB_PORT} with user ${DB_USER}.`)
    } catch (e) {
        console.error("Failed to connect to the database. Err: ", e);
    }
}

export async function syncDB() {
    try {
        await sequelize.sync({ alter: false })
        console.log("The database synchronization was successful.")
    } catch (e) {
        console.error("Failed to syncrhonize database. Err: ", e);
    }
}

export default sequelize;