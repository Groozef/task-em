import React, { useState, useEffect } from "react";
import api from "../../services/service";

interface History {
    history_id: number;
    product_id: number;
    shop_id: number;
    action: string;
    quantity_actions: number;
    action_date: string;
    product_plu: string;
    product_name: string;
    shop_name: string;
}

const HistoryPage: React.FC = () => {
    const [history, setHistory] = useState<History[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [filters, setFilters] = useState({
        shop_id: "",
        plu: "",
        product_name: "",
        shop_name: "",
        start_date: "",
        end_date: "",
        action: "",
        page: 1,
        limit: 10,
    });

    const fetchHistory = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await api.get("/history", {
                params: {
                    ...filters,
                    plu: filters.plu || null,
                    product_name: filters.product_name || null,
                    shop_name: filters.shop_name || null,
                },
            });
            setHistory(response.data.data);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Неизвестная ошибка";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [filters]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const handleResetFilters = () => {
        setFilters({
            shop_id: "",
            plu: "",
            product_name: "",
            shop_name: "",
            start_date: "",
            end_date: "",
            action: "",
            page: 1,
            limit: 10,
        });
    };

    return (
        <div className="p-6 bg-gray-800 text-white min-h-screen">
            <h1 className="text-2xl font-bold mb-6">История действий с товарами</h1>

            {loading && <p className="text-gray-500">Загрузка...</p>}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="mb-6">
                <h2 className="text-lg font-semibold">Фильтры</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <input
                            type="text"
                            name="plu"
                            placeholder="Артикул товара"
                            value={filters.plu}
                            onChange={handleFilterChange}
                            className="p-2 rounded bg-gray-700 border border-gray-600 w-full"
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="product_name"
                            placeholder="Название товара"
                            value={filters.product_name}
                            onChange={handleFilterChange}
                            className="p-2 rounded bg-gray-700 border border-gray-600 w-full"
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="shop_name"
                            placeholder="Название магазина"
                            value={filters.shop_name}
                            onChange={handleFilterChange}
                            className="p-2 rounded bg-gray-700 border border-gray-600 w-full"
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="shop_id"
                            placeholder="ID магазина"
                            value={filters.shop_id}
                            onChange={handleFilterChange}
                            className="p-2 rounded bg-gray-700 border border-gray-600 w-full"
                        />
                    </div>
                    <div>
                        <input
                            type="date"
                            name="start_date"
                            value={filters.start_date}
                            onChange={handleFilterChange}
                            className="p-2 rounded bg-gray-700 border border-gray-600 w-full"
                        />
                    </div>
                    <div>
                        <input
                            type="date"
                            name="end_date"
                            value={filters.end_date}
                            onChange={handleFilterChange}
                            className="p-2 rounded bg-gray-700 border border-gray-600 w-full"
                        />
                    </div>
                    <div>
                        <select
                            name="action"
                            value={filters.action}
                            onChange={handleFilterChange}
                            className="p-2 rounded bg-gray-700 border border-gray-600 w-full"
                        >
                            <option value="">Тип изменения</option>
                            <option value="added stock">Добавлено</option>
                            <option value="ordered stock">Заказано</option>
                            <option value="sold stock">Продано</option>
                            <option value="returned stock">Возвращено</option>
                            <option value="adjusted stock">Скорректировано</option>
                        </select>
                    </div>
                </div>
                <div className="flex space-x-4">
                    <button
                        onClick={fetchHistory}
                        className="p-2 rounded bg-blue-500 text-white"
                    >
                        Применить фильтр
                    </button>
                    <button
                        onClick={handleResetFilters}
                        className="p-2 rounded bg-gray-500 text-white"
                    >
                        Сбросить фильтры
                    </button>
                </div>
            </div>

            <table className="table-auto w-full border-collapse border border-gray-700 mb-6">
                <thead>
                    <tr className="bg-gray-600">
                        <th className="border border-gray-700 px-4 py-2 text-center">ID действия</th>
                        <th className="border border-gray-700 px-4 py-2 text-center">ID товара</th>
                        <th className="border border-gray-700 px-4 py-2 text-center">Артикул товара</th>
                        <th className="border border-gray-700 px-4 py-2 text-center">Название товара</th>
                        <th className="border border-gray-700 px-4 py-2 text-center">ID магазина</th>
                        <th className="border border-gray-700 px-4 py-2 text-center">Название магазина</th>
                        <th className="border border-gray-700 px-4 py-2 text-center">Тип изменения</th>
                        <th className="border border-gray-700 px-4 py-2 text-center">Дата изменения</th>
                        <th className="border border-gray-700 px-4 py-2 text-center">Количество изменений</th>
                    </tr>
                </thead>
                <tbody>
                    {history.length > 0 ? (
                        history.map((record) => (
                            <tr key={record.history_id} className="hover:bg-gray-700">
                                <td className="border border-gray-700 px-4 py-2 text-center">{record.history_id}</td>
                                <td className="border border-gray-700 px-4 py-2 text-center">{record.product_id}</td>
                                <td className="border border-gray-700 px-4 py-2 text-center">{record.product_plu}</td>
                                <td className="border border-gray-700 px-4 py-2 text-center">{record.product_name}</td>
                                <td className="border border-gray-700 px-4 py-2 text-center">{record.shop_id}</td>
                                <td className="border border-gray-700 px-4 py-2 text-center">{record.shop_name}</td>
                                <td className="border border-gray-700 px-4 py-2 text-center">{record.action}</td>
                                <td className="border border-gray-700 px-4 py-2 text-center">{record.action_date}</td>
                                <td className="border border-gray-700 px-4 py-2 text-center">{record.quantity_actions}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={9} className="text-center text-gray-500">Нет данных</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default HistoryPage;
