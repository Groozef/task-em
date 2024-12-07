# task-em

## README (Русский)

### Как запустить проект

Для того чтобы запустить проект, необходимо открыть **две отдельные консоли**: одну для **Backend**, другую для **Frontend**.

#### Backend (Сервер)

1. Перейдите в папку с бэкендом:

    ```bash
    cd backend
    ```

2. Установите зависимости:

    ```bash
    npm install
    ```

3. Создайте файл `.env` в корне папки с бэкендом и добавьте в него строку подключения к вашей базе данных:

    ```plaintext
    DATABASE_URL=postgresql://test-task_owner:<YOUR_PASSWORD>@ep-autumn-hall-a5hkmaw5.us-east-2.aws.neon.tech/test-task?sslmode=require
    ```

    Замените `<YOUR_PASSWORD>` на реальный пароль от вашей базы данных.

4. Запустите сервер:

    ```bash
    npm start
    ```

#### Frontend (Фронтенд)

1. Перейдите в папку с фронтендом:

    ```bash
    cd frontend
    ```

2. Установите зависимости:

    ```bash
    npm install
    ```

3. Запустите фронтенд:

    ```bash
    npm start
    ```

4. Откройте браузер по адресу `http://localhost:3000`.

---

### Технологии

- **Backend**: Node.js, Express, PostgreSQL, CORS
- **Frontend**: React, TypeScript, Tailwind CSS
- **База данных**: PostgreSQL

---

### Структура базы данных

```sql
CREATE TABLE IF NOT EXISTS products(
  product_id SERIAL PRIMARY KEY,
  product_plu VARCHAR(25) NOT NULL UNIQUE,
  product_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS shops(
  shop_id SERIAL PRIMARY KEY,
  shop_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS stocks(
  stock_id SERIAL PRIMARY KEY,
  product_id int REFERENCES products(product_id) ON DELETE CASCADE,
  shop_id int REFERENCES shops(shop_id) ON DELETE CASCADE,
  stock_quantity int DEFAULT 0,
  stock_order int DEFAULT 0,
  UNIQUE(product_id, shop_id)
);

CREATE TABLE IF NOT EXISTS orders(
  order_id SERIAL PRIMARY KEY,
  product_id int REFERENCES products(product_id) ON DELETE CASCADE,
  shop_id int REFERENCES shops(shop_id) ON DELETE CASCADE,
  quantity INT NOT NULL,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  STATUS VARCHAR(50) NOT NULL DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS history(
  history_id SERIAL PRIMARY KEY,
  product_id int REFERENCES products(product_id) ON DELETE CASCADE,
  shop_id int REFERENCES shops(shop_id) ON DELETE CASCADE,
  action VARCHAR(255),
  quantity_actions INT,
  action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
