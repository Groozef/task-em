export interface Product {
    product_id: string; 
    product_plu: string;
    product_name: string;
}


export type Stock = {
    stock_id: number;
    product_id: number;
    product_plu: string;
    product_name: string;
    stock_quantity: number;
    stock_order: number;
    shop_id: number;
    shop_name: string;
};


export type Filters = {
    product_plu: string;
    shop_id: string;
    stock_quantity_min: string;
    stock_quantity_max: string;
    stock_order_min: string;
    stock_order_max: string;
};

export interface HistoryRecord {
    history_id: string; 
    action_type: 'add' | 'increase' | 'decrease' | 'remove'; 
    product_id: string; 
    product_name: string; 
    product_plu: string; 
    change_quantity: number; 
    old_quantity: number; 
    new_quantity: number; 
    created_at: string; 
    user_id: string; 
    shop_id: string; 
}
