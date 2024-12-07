import React, { useEffect, useState } from "react";
import api from "../../services/service";
import { Stock, Filters } from "../../types";

const Stocks: React.FC = () => {
    const [stocks, setStocks] = useState<Stock[]>([]); 
    const [filters, setFilters] = useState<Filters>({
        product_plu: "",
        shop_id: "",
        stock_quantity_min: "",
        stock_quantity_max: "",
        stock_order_min: "",
        stock_order_max: "",
    });
    const [error, setError] = useState<string>(""); 

    // Загрузка остатков с сервера
    const fetchStocks = async () => {
        setError("");
        try {
            const response = await api.get("/get-stock-by-filter", { params: filters });
            console.log("Received data:", response.data); 
            setStocks(response.data); 
        } catch (err) {
            const message = err instanceof Error ? err.message : "Неизвестная ошибка";
            setError(message);
        }
    };

    // Увеличение остатка
    const handleIncrease = async (product_id: number | undefined, shop_id: number | undefined, amount: number) => {
        if (product_id === undefined || shop_id === undefined) {
            console.error("product_id или shop_id не определены", { product_id, shop_id });
            setError("Необходимо указать product_id и shop_id.");
            return;
        }

        try {
            await api.put("/increase-stock", {
                product_id,
                shop_id,
                stock_quantity: amount,
            });
            setStocks((prevStocks) =>
                prevStocks.map((stock) =>
                    stock.product_id === product_id && stock.shop_id === shop_id
                        ? { ...stock, stock_quantity: stock.stock_quantity + amount } 
                        : stock
                )
            );
        } catch (err) {
            const message = err instanceof Error ? err.message : "Неизвестная ошибка";
            setError(message);
        }
    };

    // Уменьшение остатка
    const handleDecrease = async (product_id: number | undefined, shop_id: number | undefined, amount: number) => {
        if (product_id === undefined || shop_id === undefined) {
            console.error("product_id или shop_id не определены", { product_id, shop_id });
            setError("Необходимо указать product_id и shop_id.");
            return;
        }

        try {
            await api.put("/decrease-stock", {
                product_id,
                shop_id,
                stock_quantity: amount,
            });

            setStocks((prevStocks) =>
                prevStocks.map((stock) =>
                    stock.product_id === product_id && stock.shop_id === shop_id
                        ? { ...stock, stock_quantity: stock.stock_quantity - amount } 
                        : stock
                )
            );
        } catch (err) {
            const message = err instanceof Error ? err.message : "Неизвестная ошибка";
            setError(message);
        }
    };

    useEffect(() => {
        fetchStocks();
    }, [filters]); 

    return (
        <div className="p-6 bg-gray-800 text-white min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Остатки товаров</h1>

            {/* Фильтры */}
            <div className="flex flex-wrap gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Фильтр по PLU"
                    value={filters.product_plu}
                    onChange={(e) => setFilters({ ...filters, product_plu: e.target.value })}
                    className="border rounded px-4 py-2 text-gray-900"
                />
                <input
                    type="text"
                    placeholder="ID магазина"
                    value={filters.shop_id}
                    onChange={(e) => setFilters({ ...filters, shop_id: e.target.value })}
                    className="border rounded px-4 py-2 text-gray-900"
                />
                <input
                    type="number"
                    placeholder="Мин. кол-во на складе"
                    value={filters.stock_quantity_min}
                    onChange={(e) => setFilters({ ...filters, stock_quantity_min: e.target.value })}
                    className="border rounded px-4 py-2 text-gray-900"
                />
                <input
                    type="number"
                    placeholder="Макс. кол-во на складе"
                    value={filters.stock_quantity_max}
                    onChange={(e) => setFilters({ ...filters, stock_quantity_max: e.target.value })}
                    className="border rounded px-4 py-2 text-gray-900"
                />
                <input
                    type="number"
                    placeholder="Мин. кол-во в заказе"
                    value={filters.stock_order_min}
                    onChange={(e) => setFilters({ ...filters, stock_order_min: e.target.value })}
                    className="border rounded px-4 py-2 text-gray-900"
                />
                <input
                    type="number"
                    placeholder="Макс. кол-во в заказе"
                    value={filters.stock_order_max}
                    onChange={(e) => setFilters({ ...filters, stock_order_max: e.target.value })}
                    className="border rounded px-4 py-2 text-gray-900"
                />
                <button
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
                    onClick={() =>
                        setFilters({
                            product_plu: "",
                            shop_id: "",
                            stock_quantity_min: "",
                            stock_quantity_max: "",
                            stock_order_min: "",
                            stock_order_max: "",
                        })
                    }>
                    Сбросить фильтры
                </button>
            </div>

            {/* Ошибки */}
            {error && <p className="text-red-500">{error}</p>}

            {/* Таблица */}
            <table className="table-auto w-full border-collapse border border-gray-700">
                <thead>
                    <tr className="bg-gray-600">
                        <th className="border border-gray-700 px-4 py-2">PLU</th>
                        <th className="border border-gray-700 px-4 py-2">Название товара</th>
                        <th className="border border-gray-700 px-4 py-2">Количество на складе</th>
                        <th className="border border-gray-700 px-4 py-2">Количество в заказе</th>
                        <th className="border border-gray-700 px-4 py-2">ID Магазина</th>
                        <th className="border border-gray-700 px-4 py-2">Магазин</th>
                        <th className="border border-gray-700 px-4 py-2">+/- к остатку на складе</th>
                    </tr>
                </thead>
                <tbody>
                    {stocks.map((stock) => (
                        <tr key={stock.stock_id}>
                            <td className="border border-gray-700 px-4 py-2">{stock.product_plu}</td>
                            <td className="border border-gray-700 px-4 py-2">{stock.product_name}</td>
                            <td className="border border-gray-700 px-4 py-2">{stock.stock_quantity}</td>
                            <td className="border border-gray-700 px-4 py-2">{stock.stock_order}</td>
                            <td className="border border-gray-700 px-4 py-2">{stock.shop_id}</td>
                            <td className="border border-gray-700 px-4 py-2">{stock.shop_name}</td>
                            <td className="border border-gray-700 px-4 py-2">
                                <button
                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                    onClick={() => {
                                        console.log("Increase", stock.product_id, stock.shop_id);
                                        handleIncrease(stock.product_id, stock.shop_id, 1); 
                                    }}>
                                    +
                                </button>
                                <button
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ml-2"
                                    onClick={() => {
                                        console.log("Decrease", stock.product_id, stock.shop_id);
                                        handleDecrease(stock.product_id, stock.shop_id, 1); 
                                    }}>
                                    -
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Stocks;