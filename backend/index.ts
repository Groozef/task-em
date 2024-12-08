import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import pool from "./services/db";
import productRoutes from "./routes/products.routes";
import historyRoutes from "./routes/history.routes";

// Загрузка переменных окружения
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4242;

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Тестовый маршрут
app.get("/", async (_, res: Response) => {
    try {
        const client = await pool.connect();
        const result = await client.query("SELECT version()");
        client.release();

        res.json({ version: result.rows[0].version });
    } catch (error) {
        console.error("Ошибка подключения к БД:", error);
        res.status(500).json({ error: "Ошибка подключения к базе данных" });
    }
});

app.use(productRoutes);
app.use(historyRoutes);

// Логирование запросов
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
