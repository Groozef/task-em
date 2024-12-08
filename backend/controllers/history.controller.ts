import { Request, Response } from "express";
import pool from "../services/db";

export class HistoryController {

    static async getHistory(req: Request, res: Response): Promise<void> {
        try {
            const { shop_id, plu, start_date, end_date, action, page = 1, limit = 10 } = req.query;

            const offset = (Number(page) - 1) * Number(limit);

            const query = `
                SELECT h.*, p.product_plu, p.product_name, s.shop_name
                FROM history h
                JOIN products p ON h.product_id = p.product_id
                JOIN shops s ON h.shop_id = s.shop_id
                WHERE 
                    ($1::int IS NULL OR h.shop_id = $1)
                    AND ($2::varchar IS NULL OR p.product_plu ILIKE '%' || $2 || '%')
                    AND ($3::date IS NULL OR h.action_date >= $3)
                    AND ($4::date IS NULL OR h.action_date <= $4)
                    AND ($5::varchar IS NULL OR h.action = $5)
                    AND ($6::varchar IS NULL OR p.product_name ILIKE '%' || $6 || '%')
                    AND ($7::varchar IS NULL OR s.shop_name ILIKE '%' || $7 || '%')
                ORDER BY h.action_date DESC
                LIMIT $8 OFFSET $9;
            `;

            const values = [
                shop_id || null,
                plu || null,
                start_date || null,
                end_date || null,
                action || null,
                req.query.product_name || null,
                req.query.shop_name || null,
                limit,
                offset,
            ];

            const { rows } = await pool.query(query, values);

            const countQuery = `
                SELECT COUNT(*) AS total
                FROM history h
                JOIN products p ON h.product_id = p.product_id
                JOIN shops s ON h.shop_id = s.shop_id
                WHERE 
                    ($1::int IS NULL OR h.shop_id = $1)
                    AND ($2::varchar IS NULL OR p.product_plu ILIKE '%' || $2 || '%')
                    AND ($3::date IS NULL OR h.action_date >= $3)
                    AND ($4::date IS NULL OR h.action_date <= $4)
                    AND ($5::varchar IS NULL OR h.action = $5)
                    AND ($6::varchar IS NULL OR p.product_name ILIKE '%' || $6 || '%')
                    AND ($7::varchar IS NULL OR s.shop_name ILIKE '%' || $7 || '%')
            `;

            const countResult = await pool.query(countQuery, values.slice(0, 7));
            const total = countResult.rows[0]?.total || 0;

            res.status(200).json({
                data: rows,
                meta: {
                    total: Number(total),
                    page: Number(page),
                    limit: Number(limit),
                },
            });
        } catch (error) {
            console.error("Error fetching history:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
