const pool = require("../services/db");

class ProductController {
    // Создание продукта
    async createProduct(req, res) {
        const { product_plu, product_name } = req.body;

        try {
            const result = await pool.query(
                `
                INSERT INTO products (product_plu, product_name) VALUES ($1, $2) RETURNING *
            `,
                [product_plu, product_name]
            );

            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Ошибка при создании товара" });
        }
    }

    // Создание остатка
    async createStock(req, res) {
        const { product_id, shop_id, stock_quantity, stock_order } = req.body;

        try {
            const result = await pool.query(
                `
                INSERT INTO stocks (product_id, shop_id, stock_quantity, stock_order)
                VALUES ($1, $2, $3, $4) RETURNING *
            `,
                [product_id, shop_id, stock_quantity || 0, stock_order || 0]
            );

            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Ошибка при создании остатка" });
        }
    }

    // Добавление к остатку на полке
    async increaseStock(req, res) {
        const { product_id, shop_id, stock_quantity } = req.body;

        try {
            const result = await pool.query(
                `
                UPDATE stocks 
                SET stock_quantity = stock_quantity + $1 
                WHERE product_id = $2 AND shop_id = $3 RETURNING *
            `,
                [stock_quantity, product_id, shop_id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: "Остаток не найден" });
            }

            res.status(200).json(result.rows[0]);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: "Ошибка при увеличении остатка" });
        }
    }

    // Убывание от остатка на полке
    async decreaseStock(req, res) {
        const { product_id, shop_id, stock_quantity } = req.body;

        try {
            const checkStock = await pool.query(
                `
                SELECT stock_quantity FROM stocks WHERE product_id = $1 AND shop_id = $2
            `,
                [product_id, shop_id]
            );

            if (checkStock.rows.length === 0) {
                return res.status(404).json({ error: "Остаток не найден" });
            }

            if (stock_quantity <= 0) {
                return res.status(400).json({ error: "Количество товара должно быть положительным" });
            }

            const availableQuantity = checkStock.rows[0].stock_quantity;

            if (availableQuantity < stock_quantity) {
                return res.status(400).json({ error: "Недостаточно товара на складе" });
            }

            const result = await pool.query(
                `
                UPDATE stocks 
                SET stock_quantity = stock_quantity - $1 
                WHERE product_id = $2 AND shop_id = $3 RETURNING *
            `,
                [stock_quantity, product_id, shop_id]
            );

            res.status(200).json(result.rows[0]);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: "Ошибка при уменьшении остатка" });
        }
    }

    // Фильтрация остатка
    async getStockByFilter(req, res) {
        const { product_plu, shop_id, stock_quantity_min, stock_quantity_max, stock_order_min, stock_order_max } = req.query;
        try {
            const query = `
                SELECT stocks.stock_quantity, stocks.stock_order, products.product_plu, products.product_name, shops.shop_name, shops.shop_id, stocks.product_id
                FROM stocks
                INNER JOIN products ON stocks.product_id = products.product_id
                INNER JOIN shops ON stocks.shop_id = shops.shop_id
                WHERE
                    ($1::VARCHAR IS NULL OR products.product_plu = $1)
                    AND ($2::INT IS NULL OR stocks.shop_id = $2)
                    AND ($3::INT IS NULL OR stocks.stock_quantity >= $3)
                    AND ($4::INT IS NULL OR stocks.stock_quantity <= $4)
                    AND ($5::INT IS NULL OR stocks.stock_order >= $5)
                    AND ($6::INT IS NULL OR stocks.stock_order <= $6);
            `;
   
            const result = await pool.query(query, [
                product_plu || null,
                shop_id || null,
                stock_quantity_min || null,
                stock_quantity_max || null,
                stock_order_min || null,
                stock_order_max || null,
            ]);
   
            res.status(200).json(result.rows);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Ошибка при получении остатков" });
        }
    }
   

    // Фильтрация товара
    async getProductsByFilter(req, res) {
        const { product_name, product_plu } = req.query;

        try {
            const query = `
                SELECT product_plu, product_name
                FROM products
                WHERE
                    ($1::VARCHAR IS NULL OR product_name ILIKE '%' || $1 || '%')
                    AND ($2::VARCHAR IS NULL OR product_plu = $2);
            `;

            const result = await pool.query(query, [product_name, product_plu]);

            res.status(200).json(result.rows);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Ошибка при получении товаров" });
        }
    }
}

module.exports = ProductController;