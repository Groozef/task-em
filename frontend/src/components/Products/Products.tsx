import React, { useState, useEffect } from "react";
import { Product } from "../../types/index";
import api from "../../services/service";

const Products: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [filters, setFilters] = useState({ product_name: "", product_plu: "" });
    const [newProduct, setNewProduct] = useState<{ product_plu: string; product_name: string }>({ product_plu: "", product_name: "" });
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState<string | null>(null); 

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);

        try {
            // Загружаем все товары
            const response = await api.get<Product[]>('/get-products-by-filter');
            setProducts(response.data);
            setFilteredProducts(response.data); 
        } catch (err) {
            console.error("Ошибка загрузки товаров", err);
            setError("Не удалось загрузить товары. Попробуйте позже.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleFilterChange = () => {
        const filtered = products.filter((product) => {
            const nameMatch = product.product_name.includes(filters.product_name);
            const pluMatch = product.product_plu.includes(filters.product_plu);
            return nameMatch && pluMatch;
        });
        setFilteredProducts(filtered);
    };

    useEffect(() => {
        handleFilterChange(); 
    }, [filters, products]);

    const addProduct = async () => {
        setError(null);
        try {
            if (!newProduct.product_plu || !newProduct.product_name) {
                alert("Введите PLU и название товара");
                return;
            }

            const newProductWithId = { 
                ...newProduct, 
                product_id: Math.random().toString(36).substr(2, 9)
            };

            // Отправляем запрос на добавление товара
            await api.post("/create-product", newProduct);

            // Обновляем список товаров с новым продуктом
            setProducts((prevProducts) => [...prevProducts, newProductWithId]);
            setFilteredProducts((prevFiltered) => [...prevFiltered, newProductWithId]);

            // Очищаем поля ввода
            setNewProduct({ product_plu: "", product_name: "" });
        } catch (err) {
            console.error("Ошибка при добавлении товара", err);
            setError("Не удалось добавить товар. Попробуйте позже.");
        }
    };

    return (
        <div className="p-6 bg-gray-800 text-white min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Список товаров</h1>

            {/* Фильтры */}
            <div className="flex gap-4 mb-6">
                <input
                    type="text"
                    name="product_name"
                    placeholder="Фильтр по названию"
                    className="border rounded px-4 py-2 w-full text-gray-900"
                    value={filters.product_name}
                    onChange={(e) => setFilters({ ...filters, product_name: e.target.value })}
                />
                <input
                    type="text"
                    name="product_plu"
                    placeholder="Фильтр по PLU"
                    className="border rounded px-4 py-2 w-full text-gray-900"
                    value={filters.product_plu}
                    onChange={(e) => setFilters({ ...filters, product_plu: e.target.value })}
                />
                <button
                    onClick={() => {
                        setFilters({ product_name: "", product_plu: "" });
                        setFilteredProducts(products); // Сброс фильтров
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                    Сбросить
                </button>
            </div>

            {/* Сообщение об ошибке */}
            {error && <div className="text-red-500 mb-4">{error}</div>}

            {/* Таблица товаров */}
            {loading ? (
                <p className="text-gray-500">Загрузка...</p>
            ) : filteredProducts.length === 0 ? (
                <p className="text-gray-500">Товары не найдены</p>
            ) : (
                <table className="table-auto w-full border-collapse border border-gray-700 mb-6">
                    <thead>
                        <tr className="bg-gray-600">
                            <th className="border border-gray-700 px-4 py-2 text-center">PLU</th>
                            <th className="border border-gray-700 px-4 py-2 text-center">Название</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => (
                            <tr key={product.product_plu} className="hover:bg-gray-700">
                                <td className="border border-gray-700 px-4 py-2">{product.product_plu}</td>
                                <td className="border border-gray-700 px-4 py-2">{product.product_name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Форма добавления товара */}
            <div className="p-4 border rounded bg-gray-700">
                <h2 className="text-lg font-bold mb-4">Добавить новый товар</h2>
                <div className="flex gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="PLU нового товара"
                        className="border rounded px-4 py-2 w-full text-gray-900"
                        value={newProduct.product_plu}
                        onChange={(e) => setNewProduct({ ...newProduct, product_plu: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Название нового товара"
                        className="border rounded px-4 py-2 w-full text-gray-900"
                        value={newProduct.product_name}
                        onChange={(e) => setNewProduct({ ...newProduct, product_name: e.target.value })}
                    />
                </div>
                <button
                    onClick={addProduct}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Добавить товар
                </button>
            </div>
        </div>
    );
};

export default Products;