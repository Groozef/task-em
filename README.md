# task-em

## README (English)

### How to run the project

To run the project, open **two separate terminals**: one for the **Backend** and another for the **Frontend**.

#### Backend (Server)

1. Navigate to the backend folder:

    ```bash
    cd backend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the root of the backend folder and add the database connection string:

    ```plaintext
    DATABASE_URL=postgresql://test-task_owner:<YOUR_PASSWORD>@ep-autumn-hall-a5hkmaw5.us-east-2.aws.neon.tech/test-task?sslmode=require
    ```

    Replace `<YOUR_PASSWORD>` with your actual database password.

4. Start the server:

    ```bash
    npm start
    ```

#### Frontend

1. Navigate to the frontend folder:

    ```bash
    cd frontend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the frontend:

    ```bash
    npm start
    ```

4. Open the browser at `http://localhost:3000`.

---

### Technologies

- **Backend**: Node.js, Express, PostgreSQL, CORS
- **Frontend**: React, TypeScript, Tailwind CSS
- **Database**: PostgreSQL

---

### Database Structure

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
